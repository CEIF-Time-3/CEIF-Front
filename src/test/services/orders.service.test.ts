import { beforeEach, describe, expect, it } from "vitest";
import { ordersService } from "@/features/orders/services/orders.service";
import { useOrderStore } from "@/features/orders/stores/order.store";
import { MOCK_ORDERS } from "@/mocks/orders";

describe("ordersService and useOrderStore", () => {
	beforeEach(() => {
		useOrderStore.setState({
			orders: MOCK_ORDERS,
			isLoading: false,
			error: null,
		});
	});

	it("returns mock orders from getAll", async () => {
		const result = await ordersService.getAll();
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.length).toBeGreaterThan(0);
		}
	});

	it("validates updateStatus input", async () => {
		const valid = await ordersService.updateStatus("ord-1", "preparing");
		expect(valid).toEqual({
			success: true,
			data: { orderId: "ord-1", status: "preparing" },
		});

		const invalid = await ordersService.updateStatus("", "preparing");
		expect(invalid.success).toBe(false);
		if (!invalid.success) {
			expect(invalid.error).toBe("ID do pedido é obrigatório");
		}
	});

	it("updates order state in useOrderStore", () => {
		const firstId = MOCK_ORDERS[0].id;

		useOrderStore.getState().setLoading(true);
		expect(useOrderStore.getState().isLoading).toBe(true);

		useOrderStore.getState().setError("Erro teste");
		expect(useOrderStore.getState().error).toBe("Erro teste");

		useOrderStore.getState().setOrders(MOCK_ORDERS);
		expect(useOrderStore.getState().error).toBeNull();

		useOrderStore.getState().updateStatusInStore(firstId, "completed");
		expect(
			useOrderStore.getState().orders.find((o) => o.id === firstId)?.status,
		).toBe("completed");
	});
});
