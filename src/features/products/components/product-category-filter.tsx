import React from "react";
import { Button } from "@/components/ui/button";
import {
	deduplicateCategoryNames,
	normalizeCategoryName,
} from "@/features/products/utils/category-filter";

interface ProductCategoryFilterProps {
	categories: string[];
	selectedCategory: string;
	onSelectCategory: (category: string) => void;
}

export const ProductCategoryFilter = ({
	categories,
	selectedCategory,
	onSelectCategory,
}: ProductCategoryFilterProps) => {
	const uniqueCategories = React.useMemo(
		() => deduplicateCategoryNames(categories),
		[categories],
	);
	const normalizedSelectedCategory = normalizeCategoryName(selectedCategory);

	return (
		<div className="flex w-full flex-wrap items-center gap-2 pb-2">
			{uniqueCategories.map((category) => {
				const normalizedCategory = normalizeCategoryName(category);
				const isSelected = normalizedSelectedCategory === normalizedCategory;

				return (
					<Button
						key={normalizedCategory}
						type="button"
						variant={isSelected ? "default" : "outline"}
						size="sm"
						onClick={() => onSelectCategory(category)}
						className={`h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition-all ${
							isSelected
								? "bg-primary text-primary-foreground shadow-sm"
								: "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
						}`}
					>
						{category}
					</Button>
				);
			})}
		</div>
	);
};
