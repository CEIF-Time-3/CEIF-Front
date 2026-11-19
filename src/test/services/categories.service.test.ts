import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { categorieService } from "@/features/categories/services/categories.service";
import { useCategorieStore } from "@/features/categories/stores/categorie.store";
import * as httpModule from "@/utils/http";

describe("CategorieService and useCategorieStore", () => {
	beforeEach(() => {
		useCategorieStore.setState({
			categories: [],
			isLoading: false,
			error: null,
		});
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("fetches categories successfully", async () => {
		vi.spyOn(httpModule, "http").mockResolvedValue({
			success: true,
			data: [
				{ id: "cat-1", name: "Salgados" },
				{ id: "cat-2", name: "Doces" },
			],
		});

		const result = await categorieService.getAll();
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toHaveLength(2);
		}
	});

	it("handles errors in categorieService.getAll", async () => {
		vi.spyOn(httpModule, "http").mockRejectedValue(new Error("Erro API"));

		const result = await categorieService.getAll();
		expect(result).toEqual({ success: false, error: "Erro API" });
	});

	it("updates state in useCategorieStore", async () => {
		vi.spyOn(categorieService, "getAll").mockResolvedValueOnce({
			success: true,
			data: [{ id: "cat-1", name: "Bebidas" }],
		});

		await useCategorieStore.getState().getAll();
		expect(useCategorieStore.getState().categories).toEqual([
			{ id: "cat-1", name: "Bebidas" },
		]);

		vi.spyOn(categorieService, "getAll").mockResolvedValueOnce({
			success: false,
			error: "Falha",
		});
		await useCategorieStore.getState().getAll();
		expect(useCategorieStore.getState().error).toBe("Falha");

		useCategorieStore
			.getState()
			.setCategories([{ id: "cat-2", name: "Combos" }]);
		expect(useCategorieStore.getState().error).toBeNull();
		expect(useCategorieStore.getState().categories).toHaveLength(1);
	});
});
