import { useCallback, useEffect, useMemo } from "react";
import { productService } from "@/features/products/services/product-service";
import { useProductStore } from "@/features/products/stores/use-product-store";

export const useProducts = () => {
	const {
		products,
		categories,
		isLoading,
		error,
		searchQuery,
		selectedCategory,
		sortBy,
		setProducts,
		setCategories,
		setSearchQuery,
		setSelectedCategory,
		setSortBy,
		setIsLoading,
		setError,
		resetFilters,
	} = useProductStore();

	const loadProductsData = useCallback(async () => {
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

	useEffect(() => {
		loadProductsData();
	}, [loadProductsData]);

	const filteredProducts = useMemo(() => {
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
	}, [products, searchQuery, selectedCategory, sortBy]);

	return {
		products,
		filteredProducts,
		categories,
		isLoading,
		error,
		searchQuery,
		selectedCategory,
		sortBy,
		setSearchQuery,
		setSelectedCategory,
		setSortBy,
		resetFilters,
		refetch: loadProductsData,
	};
};
