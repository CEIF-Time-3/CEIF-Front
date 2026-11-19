import { beforeEach, describe, expect, it } from "vitest";
import {
	parseProductPrice,
	useCartStore,
} from "@/features/cart/stores/cart.store";
import type { Product } from "@/features/products/schemas/products.schema";

const pastelCarne = {
	id: "prod-1",
	name: "Pastel de Carne",
	price: "12,50",
	imageUrl: "https://example.com/pastel.jpg",
} as unknown as Product;

describe("parseProductPrice", () => {
	it("handles numeric inputs including NaN", () => {
		expect(parseProductPrice(15.5)).toBe(15.5);
		expect(parseProductPrice(Number.NaN)).toBe(0);
	});

	it("parses Brazilian and dot-decimal formatted strings", () => {
		expect(parseProductPrice("1.234,50")).toBe(1234.5);
		expect(parseProductPrice("19.90")).toBe(19.9);
		expect(parseProductPrice("invalido")).toBe(0);
	});
});

describe("useCartStore", () => {
	beforeEach(() => {
		localStorage.clear();
		useCartStore.setState({ items: [] });
	});

	it("adds items and merges quantities when product and observation match", () => {
		useCartStore.getState().addItem(pastelCarne, 1);
		useCartStore.getState().addItem(pastelCarne, 2);

		const items = useCartStore.getState().items;
		expect(items).toHaveLength(1);
		expect(items[0].quantity).toBe(3);
		expect(items[0].unitPrice).toBe(12.5);
	});

	it("keeps separate entries when observation differs", () => {
		useCartStore.getState().addItem(pastelCarne, 1, "sem cebola");
		useCartStore.getState().addItem(pastelCarne, 1, "bem passado");

		const items = useCartStore.getState().items;
		expect(items).toHaveLength(2);
		expect(items[0].observation).toBe("sem cebola");
		expect(items[1].observation).toBe("bem passado");
	});

	it("updates quantity and removes item when quantity <= 0", () => {
		useCartStore.getState().addItem(pastelCarne, 2);
		const itemId = useCartStore.getState().items[0].id;

		useCartStore.getState().updateQuantity(itemId, 5);
		expect(useCartStore.getState().items[0].quantity).toBe(5);

		useCartStore.getState().updateQuantity(itemId, 0);
		expect(useCartStore.getState().items).toHaveLength(0);
	});

	it("updates observation and clears empty observation to null", () => {
		useCartStore.getState().addItem(pastelCarne, 1);
		const itemId = useCartStore.getState().items[0].id;

		useCartStore.getState().updateObservation(itemId, "sem azeitona");
		expect(useCartStore.getState().items[0].observation).toBe("sem azeitona");

		useCartStore.getState().updateObservation(itemId, "");
		expect(useCartStore.getState().items[0].observation).toBeNull();
	});

	it("clears the cart", () => {
		useCartStore.getState().addItem(pastelCarne, 1);
		useCartStore.getState().clearCart();
		expect(useCartStore.getState().items).toEqual([]);
	});
});
