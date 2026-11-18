import { create } from "zustand";
import type { Categorie } from "@/features/categories/schemas/categories.schema";
import { categorieService } from "@/features/categories/services/categories.service";
import type { Result } from "@/types/result";

export interface CategorieState {
	categories: Categorie[];
	isLoading: boolean;
	error: string | null;
}

export interface CategorieActions {
	setCategories: (categories: Categorie[]) => void;
	getAll: () => Promise<Result<Categorie[], string>>;
}

export type CategorieStore = CategorieState & CategorieActions;

const initialState: CategorieState = {
	categories: [],
	isLoading: false,
	error: null,
};

export const useCategorieStore = create<CategorieStore>((set) => ({
	...initialState,

	setCategories: (categories) => set({ categories, error: null }),

	getAll: async () => {
		set({ isLoading: true, error: null });
		const result = await categorieService.getAll();
		set(
			result.success
				? { categories: result.data, isLoading: false }
				: { isLoading: false, error: result.error },
		);
		return result;
	},
}));
