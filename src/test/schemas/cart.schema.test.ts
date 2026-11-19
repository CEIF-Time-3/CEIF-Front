import { describe, expect, it } from "vitest";
import {
	cartItemSchema,
	checkoutSchema,
} from "@/features/cart/schemas/cart.schema";

describe("cart schemas", () => {
	it("validates a valid cart item", () => {
		const parsed = cartItemSchema.safeParse({
			id: "item-1",
			productId: "prod-1",
			name: "Pastel de Queijo",
			price: "12,00",
			unitPrice: 12,
			quantity: 2,
			observation: "Sem orégano",
		});

		expect(parsed.success).toBe(true);
	});

	it("requires street, number and neighborhood when deliveryType is delivery", () => {
		const result = checkoutSchema.safeParse({
			customerName: "Ana Paula",
			customerPhone: "85999990001",
			deliveryType: "delivery",
			paymentMethod: "pix",
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			const paths = result.error.issues.map((i) => i.path[0]);
			expect(paths).toContain("street");
			expect(paths).toContain("number");
			expect(paths).toContain("neighborhood");
		}
	});

	it("allows takeaway without address fields", () => {
		const result = checkoutSchema.safeParse({
			customerName: "Ana Paula",
			customerPhone: "85999990001",
			deliveryType: "takeaway",
			paymentMethod: "card",
		});

		expect(result.success).toBe(true);
	});

	it("accepts delivery when address fields are filled", () => {
		const result = checkoutSchema.safeParse({
			customerName: "Ana Paula",
			customerPhone: "85999990001",
			deliveryType: "delivery",
			street: "Rua A",
			number: "10",
			neighborhood: "Centro",
			paymentMethod: "cash",
			changeFor: "50,00",
		});

		expect(result.success).toBe(true);
	});
});
