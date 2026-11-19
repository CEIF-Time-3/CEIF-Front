import type { Categorie } from "@/features/categories/schemas/categories.schema";

export const ALL_CATEGORIES_OPTION = "Todos";

const cleanCategoryLabel = (name: string): string =>
	name.normalize("NFC").trim().replace(/\s+/g, " ");

export const normalizeCategoryName = (name: string): string =>
	cleanCategoryLabel(name).toLowerCase();

export const deduplicateCategoryNames = (
	names: readonly string[],
	options?: { excludeAllOption?: boolean },
): string[] => {
	const seen = new Set<string>();
	const uniqueNames: string[] = [];
	const allKey = normalizeCategoryName(ALL_CATEGORIES_OPTION);

	for (const rawName of names) {
		const cleaned = cleanCategoryLabel(rawName);
		if (!cleaned) continue;

		const key = cleaned.toLowerCase();
		if (options?.excludeAllOption && key === allKey) continue;
		if (seen.has(key)) continue;

		seen.add(key);
		uniqueNames.push(cleaned);
	}

	return uniqueNames;
};

export const buildCategoryFilterOptions = (
	categories: readonly Pick<Categorie, "name">[],
): string[] => [
	ALL_CATEGORIES_OPTION,
	...deduplicateCategoryNames(
		categories.map((category) => category.name),
		{ excludeAllOption: true },
	),
];
