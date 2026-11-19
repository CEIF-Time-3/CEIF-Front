import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Categorie } from "@/features/categories/schemas/categories.schema";
import { useProducts } from "@/features/products/hooks/use-products";
import type { ProductWithCategory } from "@/features/products/schemas/products.schema";
import { useProductStore } from "@/features/products/stores/product.store";
import {
	buildCategoryFilterOptions,
	deduplicateCategoryNames,
} from "@/features/products/utils/category-filter";

const duplicatedCategories: Categorie[] = [
	{ id: "cat-1", name: "Salgados" },
	{ id: "cat-2", name: "Doces" },
	{ id: "cat-3", name: "Salgados" },
	{ id: "cat-4", name: "  salgados  " },
	{ id: "cat-5", name: "DOCES" },
	{ id: "cat-6", name: "Todos" },
	{ id: "cat-7", name: "   " },
	{ id: "cat-8", name: "Bebidas" },
];

const sampleProducts: ProductWithCategory[] = [
	{
		id: "prod-1",
		name: "Pastel de Carne",
		price: "15,00",
		imageUrl: null,
		description: "Recheado com carne",
		available: true,
		ingredients: "Carne",
		categoryId: "cat-1",
		categoryName: null,
	},
	{
		id: "prod-2",
		name: "Pastel de Queijo",
		price: "14,00",
		imageUrl: null,
		description: "Queijo derretido",
		available: true,
		ingredients: "Queijo",
		categoryId: "cat-3",
		categoryName: null,
	},
	{
		id: "prod-3",
		name: "Pastel de Chocolate",
		price: "18,00",
		imageUrl: null,
		description: "Chocolate ao leite",
		available: true,
		ingredients: "Chocolate",
		categoryId: "cat-5",
		categoryName: "Doces",
	},
];

describe("category-filter utils and useProducts", () => {
	beforeEach(() => {
		useProductStore.setState({ products: [], isLoading: false, error: null });
	});

	it("deduplicates category names ignoring case, extra spaces and empty values", () => {
		expect(
			deduplicateCategoryNames([
				"Salgados",
				"salgados",
				"  Salgados  ",
				"Pastel  Doce",
				"Pastel Doce",
				"",
				"   ",
			]),
		).toEqual(["Salgados", "Pastel Doce"]);

		expect(buildCategoryFilterOptions(duplicatedCategories)).toEqual([
			"Todos",
			"Salgados",
			"Doces",
			"Bebidas",
		]);
	});

	it("builds unique categoriesOptions and matches products across duplicate category IDs", () => {
		const { result } = renderHook(() =>
			useProducts({
				initialProducts: sampleProducts,
				categories: duplicatedCategories,
			}),
		);

		expect(result.current.categoriesOptions).toEqual([
			"Todos",
			"Salgados",
			"Doces",
			"Bebidas",
		]);
		expect(result.current.filteredProducts).toHaveLength(3);

		act(() => {
			result.current.setSelectedCategory("Salgados");
		});

		expect(result.current.filteredProducts.map((p) => p.id)).toEqual([
			"prod-1",
			"prod-2",
		]);

		act(() => {
			result.current.setSelectedCategory("Doces");
		});

		expect(result.current.filteredProducts.map((p) => p.id)).toEqual([
			"prod-3",
		]);
	});
});
