import { describe, expect, it } from "vitest";
import { z } from "zod";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { HttpError } from "@/utils/http";

describe("getErrorMessage", () => {
	it("returns standardized message for ZodError", () => {
		const parsed = z.string().safeParse(123);
		expect(parsed.success).toBe(false);
		if (!parsed.success) {
			expect(getErrorMessage(parsed.error)).toBe(
				"Estrutura de dados inválida retornada pelo servidor.",
			);
		}
	});

	it("returns message for HttpError", () => {
		const error = new HttpError(404, "Recurso não encontrado");
		expect(getErrorMessage(error)).toBe("Recurso não encontrado");
	});

	it("returns message for generic Error", () => {
		expect(getErrorMessage(new Error("Falha inesperada"))).toBe(
			"Falha inesperada",
		);
	});

	it("stringifies non-Error values", () => {
		expect(getErrorMessage("erro simples")).toBe("erro simples");
		expect(getErrorMessage(42)).toBe("42");
	});
});
