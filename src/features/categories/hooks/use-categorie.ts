"use client";

import React from "react";
import type { Categorie } from "@/features/categories/schemas/categories.schema";
import { useCategorieStore } from "@/features/categories/stores/categorie.store";

export const useCategorie = (initialCategories?: Categorie[]) => {
	const categories = useCategorieStore((state) => state.categories);
	const isLoading = useCategorieStore((state) => state.isLoading);
	const error = useCategorieStore((state) => state.error);
	const setCategories = useCategorieStore((state) => state.setCategories);
	const getAll = useCategorieStore((state) => state.getAll);

	React.useEffect(() => {
		if (initialCategories && initialCategories.length > 0) {
			setCategories(initialCategories);
			return;
		}

		void getAll();
	}, [initialCategories, setCategories, getAll]);

	return {
		categories,
		isLoading,
		error,
		setCategories,
		getAll,
	};
};
