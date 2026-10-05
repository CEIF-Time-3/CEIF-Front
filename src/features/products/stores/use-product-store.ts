import { create } from "zustand";
import type { Product } from "@/features/products/schemas/product-schema";

interface ProductState {
	products: Product[];
	categories: string[];
	isLoading: boolean;
	error: string | null;
	searchQuery: string;
	selectedCategory: string;
	sortBy: string;

	setProducts: (products: Product[]) => void;
	setCategories: (categories: string[]) => void;
	setSearchQuery: (query: string) => void;
	setSelectedCategory: (category: string) => void;
	setSortBy: (sort: string) => void;
	setIsLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	resetFilters: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
	products: [],
	categories: ["Todos"],
	isLoading: false,
	error: null,
	searchQuery: "",
	selectedCategory: "Todos",
	sortBy: "price-asc",

	setProducts: (products) => set({ products }),
	setCategories: (categories) => set({ categories }),
	setSearchQuery: (searchQuery) => set({ searchQuery }),
	setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
	setSortBy: (sortBy) => set({ sortBy }),
	setIsLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),
	resetFilters: () =>
		set({ searchQuery: "", selectedCategory: "Todos", sortBy: "price-asc" }),
}));
