import { Button } from "@/components/ui/button";

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
	return (
		<div className="flex w-full flex-wrap items-center gap-2 pb-2">
			{categories.map((category) => {
				const isSelected =
					selectedCategory.toLowerCase() === category.toLowerCase();

				return (
					<Button
						key={category}
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
