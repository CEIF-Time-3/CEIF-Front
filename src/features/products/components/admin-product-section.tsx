"use client";

import { Package } from "lucide-react";

import type { Categorie } from "@/features/categories/schemas/categories.schema";
import { AdminProductFilters } from "@/features/products/components/admin-product-filters";
import { AdminProductStats } from "@/features/products/components/admin-product-stats";
import { AdminProductTable } from "@/features/products/components/admin-product-table";
import { ProductCreateForm } from "@/features/products/components/forms/product-create-form";
import { useProducts } from "@/features/products/hooks/use-products";
import type { Product } from "@/features/products/schemas/products.schema";
import { useCategorie } from "@/hooks/use-categorie";

interface AdminProductSectionProps {
	initialProducts?: Product[];
	initialCategories?: Categorie[];
}

const emptyProducts: Product[] = [];
const emptyCategories: Categorie[] = [];

export const AdminProductSection = ({
	initialProducts = emptyProducts,
	initialCategories = emptyCategories,
}: AdminProductSectionProps) => {
	const { categories } = useCategorie(initialCategories);
	const {
		products,
		filteredProducts,
		isLoading,
		error,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		statusFilter,
		setStatusFilter,
		resetFilters,
	} = useProducts({
		initialProducts,
		categories,
	});

	return (
		<div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 p-4 md:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
						<Package className="size-4" />
						<span>Painel de Administração</span>
					</div>
					<h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
						Gestão de Produtos
					</h1>
					<p className="text-muted-foreground text-sm">
						Gerencie, pesquise e controle a disponibilidade dos itens do
						cardápio.
					</p>
				</div>

				<ProductCreateForm categories={categories} />
			</div>

			{error && (
				<div role="alert" className="text-destructive text-sm">
					{error}
				</div>
			)}

			<AdminProductStats products={products} categories={categories} />

			<AdminProductFilters
				searchQuery={searchQuery}
				selectedCategory={selectedCategory}
				statusFilter={statusFilter}
				categories={categories}
				onSearchChange={setSearchQuery}
				onCategoryChange={setSelectedCategory}
				onStatusFilterChange={setStatusFilter}
				onResetFilters={resetFilters}
			/>

			<AdminProductTable
				products={filteredProducts}
				isLoading={isLoading}
				onResetFilters={resetFilters}
			/>
		</div>
	);
};
