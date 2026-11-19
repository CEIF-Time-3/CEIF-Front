import { afterEach, describe, expect, it, vi } from "vitest";
import {
	cartService,
	type OrderCheckoutPayload,
} from "@/features/cart/services/cart.service";
import * as httpModule from "@/utils/http";

const samplePayload: OrderCheckoutPayload = {
	customer: {
		customerName: "Maria Silva",
		customerPhone: "85999990001",
		deliveryType: "delivery",
		street: "Rua das Flores",
		number: "123",
		neighborhood: "Centro",
		paymentMethod: "pix",
	},
	items: [
		{
			id: "item-1",
			productId: "prod-1",
			name: "Pastel de Carne",
			price: "10,00",
			unitPrice: 10,
			quantity: 2,
			imageUrl: null,
			observation: null,
		},
	],
	subtotal: 20,
	deliveryFee: 7,
	discount: 0,
	total: 27,
};

describe("CartService", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns server response when POST /orders succeeds", async () => {
		const apiResponse = {
			orderId: "ORD-999999",
			message: "Pedido criado",
			createdAt: "2026-11-19T12:00:00.000Z",
		};
		const httpSpy = vi.spyOn(httpModule, "http").mockResolvedValue(apiResponse);

		const result = await cartService.createOrder(samplePayload);

		expect(httpSpy).toHaveBeenCalledWith("/orders", {
			method: "POST",
			body: JSON.stringify(samplePayload),
		});
		expect(result).toEqual({ success: true, data: apiResponse });
	});

	it("falls back to mocked order response when network request fails", async () => {
		vi.spyOn(httpModule, "http").mockRejectedValue(new Error("Offline"));

		const result = await cartService.createOrder(samplePayload);

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.orderId).toMatch(/^ORD-\d+$/);
			expect(result.data.message).toBe("Pedido registrado com sucesso!");
			expect(result.data.createdAt).toBeTruthy();
		}
	});
});
