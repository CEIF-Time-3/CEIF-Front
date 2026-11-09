import { describe, expect, it } from "vitest";
import { formatPrice } from "@/utils/format-price";

const normalize = (value: string) => value.replace(/\s/g, " ");

describe("formatPrice", () => {
	it("formats numbers as BRL", () => {
		expect(normalize(formatPrice(1234.5))).toBe("R$ 1.234,50");
	});

	it("parses pt-BR formatted strings", () => {
		expect(normalize(formatPrice("1.234,50"))).toBe("R$ 1.234,50");
	});

	it("returns zero for invalid values", () => {
		expect(normalize(formatPrice("abc"))).toBe("R$ 0,00");
	});
});
