import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	FREE_DELIVERY_THRESHOLD,
	STANDARD_DELIVERY_FEE,
	useCart,
} from "@/features/cart/hooks/use-cart";
import type { CheckoutFormValues } from "@/features/cart/schemas/cart.schema";
import { cartService } from "@/features/cart/services/cart.service";
import { useCartStore } from "@/features/cart/stores/cart.store";
import type { Product } from "@/features/products/schemas/products.schema";

const pastel = {
	id: "prod-1",
	name: "Pastel Especial",
	price: "20,00",
	imageUrl: null,
} as unknown as Product;

const validCustomer: CheckoutFormValues = {
	customerName: "João da Silva",
	customerPhone: "85999990001",
	deliveryType: "delivery",
	street: "Av. Central",
	number: "100",
	neighborhood: "Aldeota",
	paymentMethod: "pix",
};

describe("useCart", () => {
	beforeEach(() => {
		localStorage.clear();
		useCartStore.setState({ items: [] });
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("calculates delivery fee, takeaway mode, and free delivery threshold", () => {
		useCartStore.getState().addItem(pastel, 1); // subtotal = 20
		const { result } = renderHook(() => useCart());

		expect(result.current.isHydrated).toBe(true);
		expect(result.current.subtotal).toBe(20);
		expect(result.current.deliveryFee).toBe(STANDARD_DELIVERY_FEE);
		expect(result.current.remainingForFreeDelivery).toBe(
			FREE_DELIVERY_THRESHOLD - 20,
		);
		expect(result.current.total).toBe(20 + STANDARD_DELIVERY_FEE);

		act(() => {
			result.current.setDeliveryType("takeaway");
		});
		expect(result.current.deliveryFee).toBe(0);
		expect(result.current.remainingForFreeDelivery).toBe(0);
		expect(result.current.total).toBe(20);

		act(() => {
			result.current.setDeliveryType("delivery");
			result.current.addItem(pastel, 2); // subtotal = 60 >= 50
		});
		expect(result.current.deliveryFee).toBe(0);
		expect(result.current.remainingForFreeDelivery).toBe(0);
		expect(result.current.total).toBe(60);
	});

	it("applies valid coupons, handles invalid/empty coupons, and removes coupons", () => {
		useCartStore.getState().addItem(pastel, 2); // subtotal = 40
		const { result } = renderHook(() => useCart());

		let applied = false;
		act(() => {
			applied = result.current.applyCoupon("   ");
		});
		expect(applied).toBe(false);
		expect(result.current.couponError).toBe("Informe um código de cupom");

		act(() => {
			applied = result.current.applyCoupon("INVALIDO");
		});
		expect(applied).toBe(false);
		expect(result.current.couponError).toBe("Cupom inválido ou expirado");

		act(() => {
			applied = result.current.applyCoupon(" pastel10 ");
		});
		expect(applied).toBe(true);
		expect(result.current.appliedCoupon).toBe("PASTEL10");
		expect(result.current.couponError).toBeNull();
		expect(result.current.discount).toBe(4); // 10% of 40

		act(() => {
			applied = result.current.applyCoupon("bemvindo");
		});
		expect(applied).toBe(true);
		expect(result.current.discount).toBe(5);

		act(() => {
			result.current.removeCoupon();
		});
		expect(result.current.appliedCoupon).toBeNull();
		expect(result.current.couponCode).toBe("");
		expect(result.current.discount).toBe(0);
	});

	it("submits checkout order and clears cart on success", async () => {
		useCartStore.getState().addItem(pastel, 1);
		const createOrderSpy = vi
			.spyOn(cartService, "createOrder")
			.mockResolvedValue({
				success: true,
				data: {
					orderId: "ORD-123",
					message: "OK",
					createdAt: "2026-11-19T12:00:00.000Z",
				},
			});

		const { result } = renderHook(() => useCart());

		let response:
			| Awaited<ReturnType<typeof result.current.checkoutOrder>>
			| undefined;
		await act(async () => {
			response = await result.current.checkoutOrder(validCustomer);
		});

		expect(createOrderSpy).toHaveBeenCalledTimes(1);
		expect(response?.success).toBe(true);
		expect(useCartStore.getState().items).toHaveLength(0);
		expect(result.current.isSubmittingOrder).toBe(false);
	});

	it("keeps cart items if checkoutOrder fails", async () => {
		useCartStore.getState().addItem(pastel, 1);
		vi.spyOn(cartService, "createOrder").mockResolvedValue({
			success: false,
			error: "Erro no servidor",
		});

		const { result } = renderHook(() => useCart());

		await act(async () => {
			const res = await result.current.checkoutOrder(validCustomer);
			expect(res).toEqual({ success: false, error: "Erro no servidor" });
		});

		expect(useCartStore.getState().items).toHaveLength(1);
		expect(result.current.isSubmittingOrder).toBe(false);
	});
});
