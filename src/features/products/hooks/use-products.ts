import React from "react";
import type { Product } from "@/features/products/schemas/product-schema";
import { productService } from "@/features/products/services/product-service";
import { useProductStore } from "@/features/products/stores/use-product-store";

export const useProducts = (
	initialProducts?: Product[],
	initialCategories?: string[],
) => {
	const {
		products,
		categories,
		isLoading,
		error,
		searchQuery,
		selectedCategory,
		statusFilter,
		sortBy,
		setProducts,
		setCategories,
		setSearchQuery,
		setSelectedCategory,
		setStatusFilter,
		setSortBy,
		setIsLoading,
		setError,
		toggleProductAvailabilityState,
		removeProductFromState,
		addProductToState,
		resetFilters,
	} = useProductStore();

	const loadProductsData = React.useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const [fetchedProducts, fetchedCategories] = await Promise.all([
				productService.getProducts(),
				productService.getCategories(),
			]);

			setProducts(fetchedProducts);
			setCategories(fetchedCategories);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Falha ao carregar produtos. Tente novamente.";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, [setProducts, setCategories, setIsLoading, setError]);

	React.useEffect(() => {
		if (initialProducts && initialProducts.length > 0) {
			setProducts(initialProducts);
		}
		if (initialCategories && initialCategories.length > 0) {
			setCategories(initialCategories);
		}
		if (!initialProducts && products.length === 0) {
			loadProductsData();
		}
	}, [
		initialProducts,
		initialCategories,
		products.length,
		loadProductsData,
		setProducts,
		setCategories,
	]);

	const toggleAvailability = React.useCallback(
		async (id: string) => {
			try {
				toggleProductAvailabilityState(id);
				await productService.toggleAvailability(id);
			} catch (err) {
				toggleProductAvailabilityState(id);
				const message =
					err instanceof Error
						? err.message
						: "Erro ao alterar disponibilidade do produto.";
				setError(message);
			}
		},
		[toggleProductAvailabilityState, setError],
	);

	const deleteProduct = React.useCallback(
		async (id: string) => {
			try {
				removeProductFromState(id);
				await productService.deleteProduct(id);
			} catch (err) {
				loadProductsData();
				const message =
					err instanceof Error ? err.message : "Erro ao excluir o produto.";
				setError(message);
			}
		},
		[removeProductFromState, loadProductsData, setError],
	);

	const createProduct = React.useCallback(
		async (productData: Omit<Product, "id">) => {
			setIsLoading(true);
			try {
				const created = await productService.createProduct(productData);
				addProductToState(created);
				const updatedCategories = await productService.getCategories();
				setCategories(updatedCategories);
				return created;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Erro ao cadastrar produto.";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[addProductToState, setCategories, setIsLoading, setError],
	);

	const filteredProducts = React.useMemo(() => {
		let result = [...products];

		if (searchQuery.trim() !== "") {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(p) =>
					p.name.toLowerCase().includes(query) ||
					p.description.toLowerCase().includes(query) ||
					p.category.toLowerCase().includes(query),
			);
		}

		if (selectedCategory && selectedCategory !== "Todos") {
			result = result.filter(
				(p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
			);
		}

		if (statusFilter === "available") {
			result = result.filter((p) => p.isAvailable === true);
		} else if (statusFilter === "unavailable") {
			result = result.filter((p) => p.isAvailable === false);
		}

		switch (sortBy) {
			case "price-desc":
				result.sort((a, b) => b.price - a.price);
				break;
			case "name-asc":
				result.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "name-desc":
				result.sort((a, b) => b.name.localeCompare(a.name));
				break;
			default:
				result.sort((a, b) => a.price - b.price);
				break;
		}

		return result;
	}, [products, searchQuery, selectedCategory, statusFilter, sortBy]);

	return {
		products,
		filteredProducts,
		categories,
		isLoading,
		error,
		searchQuery,
		selectedCategory,
		statusFilter,
		sortBy,
		setSearchQuery,
		setSelectedCategory,
		setStatusFilter,
		setSortBy,
		toggleAvailability,
		deleteProduct,
		createProduct,
		resetFilters,
		refetch: loadProductsData,
	};
};
