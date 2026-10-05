import { create } from "zustand";
import type { Product } from "@/features/products/schemas/product-schema";

export type ProductStatusFilter = "all" | "available" | "unavailable";

interface ProductState {
	products: Product[];
	categories: string[];
	isLoading: boolean;
	error: string | null;
	searchQuery: string;
	selectedCategory: string;
	statusFilter: ProductStatusFilter;
	sortBy: string;

	setProducts: (products: Product[]) => void;
	setCategories: (categories: string[]) => void;
	setSearchQuery: (query: string) => void;
	setSelectedCategory: (category: string) => void;
	setStatusFilter: (status: ProductStatusFilter) => void;
	setSortBy: (sort: string) => void;
	setIsLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	toggleProductAvailabilityState: (id: string) => void;
	removeProductFromState: (id: string) => void;
	addProductToState: (product: Product) => void;
	resetFilters: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
	products: [],
	categories: ["Todos"],
	isLoading: false,
	error: null,
	searchQuery: "",
	selectedCategory: "Todos",
	statusFilter: "all",
	sortBy: "price-asc",

	setProducts: (products) => set({ products }),
	setCategories: (categories) => set({ categories }),
	setSearchQuery: (searchQuery) => set({ searchQuery }),
	setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
	setStatusFilter: (statusFilter) => set({ statusFilter }),
	setSortBy: (sortBy) => set({ sortBy }),
	setIsLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),

	toggleProductAvailabilityState: (id) =>
		set((state) => ({
			products: state.products.map((p) =>
				p.id === id ? { ...p, isAvailable: !p.isAvailable } : p,
			),
		})),

	removeProductFromState: (id) =>
		set((state) => ({
			products: state.products.filter((p) => p.id !== id),
		})),

	addProductToState: (product) =>
		set((state) => ({
			products: [product, ...state.products],
		})),

	resetFilters: () =>
		set({
			searchQuery: "",
			selectedCategory: "Todos",
			statusFilter: "all",
			sortBy: "price-asc",
		}),
}));
