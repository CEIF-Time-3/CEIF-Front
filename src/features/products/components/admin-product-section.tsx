"use client";

import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AdminProductFilters,
	AdminProductStats,
	AdminProductTable,
} from "@/features/products/components";
import { useProducts } from "@/features/products/hooks/use-products";
import type { Product } from "@/features/products/schemas/product-schema";

interface AdminProductSectionProps {
	initialProducts?: Product[];
	initialCategories?: string[];
}

export const AdminProductSection = ({
	initialProducts,
	initialCategories,
}: AdminProductSectionProps) => {
	const {
		products,
		filteredProducts,
		categories,
		isLoading,
		error,
		searchQuery,
		selectedCategory,
		statusFilter,
		setSearchQuery,
		setSelectedCategory,
		setStatusFilter,
		toggleAvailability,
		deleteProduct,
		resetFilters,
		refetch,
	} = useProducts(initialProducts, initialCategories);

	return (
		<div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 p-4 md:p-6">
			<div className="flex flex-col gap-1">
				<div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
					<Package className="size-4" />
					<span>Painel de Administração</span>
				</div>
				<h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
					Gestão de Produtos
				</h1>
				<p className="text-muted-foreground text-sm">
					Gerencie, pesquise e controle a disponibilidade dos itens do cardápio.
				</p>
			</div>

			{error && (
				<div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between rounded-xl border p-4 text-sm">
					<span>{error}</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => refetch()}
						className="hover:bg-destructive/20 text-xs"
					>
						Tentar novamente
					</Button>
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
				onToggleAvailability={toggleAvailability}
				onDeleteProduct={deleteProduct}
				onResetFilters={resetFilters}
			/>
		</div>
	);
};
