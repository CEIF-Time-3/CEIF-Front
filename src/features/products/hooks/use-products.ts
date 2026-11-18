"use client";

import React from "react";
import type { Categorie } from "@/features/categories/schemas/categories.schema";
import type {
	Product,
	ProductCreateInput,
	ProductUpdateInput,
	ProductWithCategory,
} from "@/features/products/schemas/products.schema";
import { useProductStore } from "@/features/products/stores/product.store";
import { MOCK_PRODUCTS } from "@/mocks/products";

export type ProductStatusFilter = "all" | "available" | "unavailable";

export interface UseProductsOptions {
	initialProducts?: Product[];
	categories?: Categorie[];
	fallbackToMock?: boolean;
}

export const useProducts = ({
	initialProducts,
	categories = [],
	fallbackToMock = false,
}: UseProductsOptions = {}) => {
	const products = useProductStore((state) => state.products);
	const isLoading = useProductStore((state) => state.isLoading);
	const error = useProductStore((state) => state.error);
	const setProducts = useProductStore((state) => state.setProducts);
	const getAll = useProductStore((state) => state.getAll);
	const create = useProductStore((state) => state.create);
	const update = useProductStore((state) => state.update);
	const setAvailability = useProductStore((state) => state.setAvailability);
	const deleteProduct = useProductStore((state) => state.deleteProduct);

	const [searchQuery, setSearchQuery] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState("Todos");
	const [statusFilter, setStatusFilter] =
		React.useState<ProductStatusFilter>("all");

	React.useEffect(() => {
		if (initialProducts !== undefined) {
			if (initialProducts.length > 0) {
				setProducts(initialProducts);
			} else if (fallbackToMock) {
				setProducts(MOCK_PRODUCTS);
			} else {
				setProducts([]);
			}
		}
	}, [initialProducts, fallbackToMock, setProducts]);

	const refreshProducts = React.useCallback(async () => {
		return await getAll();
	}, [getAll]);

	const handleCreateProduct = React.useCallback(
		async (input: ProductCreateInput) => {
			const result = await create(input);
			if (result.success) {
				await getAll();
			}
			return result;
		},
		[create, getAll],
	);

	const handleUpdateProduct = React.useCallback(
		async (id: string, input: ProductUpdateInput) => {
			return await update(id, input);
		},
		[update],
	);

	const handleSetAvailability = React.useCallback(
		async (id: string, available: boolean) => {
			return await setAvailability(id, available);
		},
		[setAvailability],
	);

	const handleDeleteProduct = React.useCallback(
		async (id: string) => {
			return await deleteProduct(id);
		},
		[deleteProduct],
	);

	const categoriesOptions = React.useMemo(
		() => ["Todos", ...categories.map((c) => c.name)],
		[categories],
	);

	const filteredProducts = React.useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		const categoryObj = categories.find(
			(c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
		);

		return products.filter((product) => {
			const productWithCategory = product as Partial<ProductWithCategory>;

			const matchesSearch =
				query === "" ||
				product.name.toLowerCase().includes(query) ||
				product.description?.toLowerCase().includes(query) === true ||
				product.ingredients?.toLowerCase().includes(query) === true ||
				productWithCategory.categoryName?.toLowerCase().includes(query) ===
					true;

			const matchesCategory =
				selectedCategory === "Todos" ||
				(categoryObj
					? productWithCategory.categoryId === categoryObj.id ||
						productWithCategory.categoryName?.toLowerCase() ===
							selectedCategory.toLowerCase() ||
						product.description
							?.toLowerCase()
							.includes(selectedCategory.toLowerCase()) === true
					: product.description
							?.toLowerCase()
							.includes(selectedCategory.toLowerCase()) === true);

			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "available" && product.available) ||
				(statusFilter === "unavailable" && !product.available);

			return matchesSearch && matchesCategory && matchesStatus;
		});
	}, [products, searchQuery, selectedCategory, statusFilter, categories]);

	const resetFilters = React.useCallback(() => {
		setSearchQuery("");
		setSelectedCategory("Todos");
		setStatusFilter("all");
	}, []);

	return {
		products,
		filteredProducts,
		categoriesOptions,
		isLoading,
		error,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		statusFilter,
		setStatusFilter,
		resetFilters,
		setProducts,
		refreshProducts,
		createProduct: handleCreateProduct,
		updateProduct: handleUpdateProduct,
		setProductAvailability: handleSetAvailability,
		deleteProduct: handleDeleteProduct,
	};
};
