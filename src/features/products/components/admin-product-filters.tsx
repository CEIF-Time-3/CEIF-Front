"use client";

import { FilterX, Search, SlidersHorizontal } from "lucide-react";

import { SelectInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductStatusFilter } from "@/features/products/stores/use-product-store";

interface AdminProductFiltersProps {
	searchQuery: string;
	selectedCategory: string;
	statusFilter: ProductStatusFilter;
	categories: string[];
	onSearchChange: (query: string) => void;
	onCategoryChange: (category: string) => void;
	onStatusFilterChange: (status: ProductStatusFilter) => void;
	onResetFilters: () => void;
}

export const AdminProductFilters = ({
	searchQuery,
	selectedCategory,
	statusFilter,
	categories,
	onSearchChange,
	onCategoryChange,
	onStatusFilterChange,
	onResetFilters,
}: AdminProductFiltersProps) => {
	const hasActiveFilters =
		searchQuery !== "" ||
		selectedCategory !== "Todos" ||
		statusFilter !== "all";

	const statusOptions = [
		{ label: "Todos os status", value: "all" },
		{ label: "Apenas Disponíveis", value: "available" },
		{ label: "Apenas Indisponíveis", value: "unavailable" },
	];

	return (
		<div className="flex flex-col gap-4 rounded-xl border border-border bg-card/70 p-4 shadow-xs backdrop-blur-xs w-full min-w-0">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full min-w-0">
				<div className="relative flex-1 min-w-0">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Buscar por nome, descrição ou categoria..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-9 bg-background"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<SlidersHorizontal className="size-3.5 shrink-0" />
						<span className="hidden sm:inline font-medium">Categoria:</span>
						<SelectInput
							size="sm"
							value={selectedCategory}
							onValueChange={onCategoryChange}
							options={categories}
							placeholder="Categoria"
						/>
					</div>

					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<span className="hidden sm:inline font-medium">Status:</span>
						<SelectInput
							size="sm"
							value={statusFilter}
							onValueChange={(val) =>
								onStatusFilterChange(val as ProductStatusFilter)
							}
							options={statusOptions}
							placeholder="Status"
						/>
					</div>

					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onResetFilters}
							className="h-9 text-xs text-muted-foreground hover:text-foreground"
						>
							<FilterX className="mr-1.5 size-3.5" />
							Limpar
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
