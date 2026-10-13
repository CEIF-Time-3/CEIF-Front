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
		updateProductInState,
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

	const refreshCategories = React.useCallback(async () => {
		try {
			const updatedCategories = await productService.getCategories();
			setCategories(updatedCategories);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Não foi possível atualizar as categorias.";
			setError(
				`A operação foi concluída, mas houve um erro ao atualizar as categorias: ${message}`,
			);
		}
	}, [setCategories, setError]);

	const toggleAvailability = React.useCallback(
		async (id: string) => {
			setError(null);
			try {
				const updatedProduct = await productService.toggleAvailability(id);
				updateProductInState(updatedProduct);
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "Erro ao alterar disponibilidade do produto.";
				setError(message);
				throw err;
			}
		},
		[updateProductInState, setError],
	);

	const deleteProduct = React.useCallback(
		async (id: string) => {
			setError(null);
			try {
				await productService.deleteProduct(id);
				removeProductFromState(id);
				await refreshCategories();
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Erro ao excluir o produto.";
				setError(message);
				throw err;
			}
		},
		[removeProductFromState, refreshCategories, setError],
	);

	const createProduct = React.useCallback(
		async (productData: Omit<Product, "id">) => {
			setIsLoading(true);
			setError(null);
			try {
				const created = await productService.createProduct(productData);
				addProductToState(created);
				await refreshCategories();
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
		[addProductToState, refreshCategories, setIsLoading, setError],
	);

	const updateProduct = React.useCallback(
		async (product: Product) => {
			setError(null);
			try {
				const updatedProduct = await productService.updateProduct(product);
				updateProductInState(updatedProduct);
				await refreshCategories();
				return updatedProduct;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Erro ao atualizar o produto.";
				setError(message);
				throw err;
			}
		},
		[updateProductInState, refreshCategories, setError],
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
		updateProduct,
		resetFilters,
		refetch: loadProductsData,
	};
};
