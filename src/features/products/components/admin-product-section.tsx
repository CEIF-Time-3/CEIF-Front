"use client";

import { Package } from "lucide-react";
import React from "react";

import type { Categorie } from "@/features/categories/schemas/categories.schema";
import {
	AdminProductFilters,
	type ProductStatusFilter,
} from "@/features/products/components/admin-product-filters";
import { AdminProductStats } from "@/features/products/components/admin-product-stats";
import { AdminProductTable } from "@/features/products/components/admin-product-table";
import { ProductCreateForm } from "@/features/products/components/forms/product-create-form";
import type { Product } from "@/features/products/schemas/products.schema";
import { useProductStore } from "@/features/products/stores/product.store";

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
	const products = useProductStore((state) => state.products);
	const isLoading = useProductStore((state) => state.isLoading);
	const error = useProductStore((state) => state.error);
	const setProducts = useProductStore((state) => state.setProducts);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState("Todos");
	const [statusFilter, setStatusFilter] =
		React.useState<ProductStatusFilter>("all");

	React.useEffect(() => {
		setProducts(initialProducts);
	}, [initialProducts, setProducts]);

	const filteredProducts = React.useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return products.filter((product) => {
			const matchesSearch =
				query === "" ||
				product.name.toLowerCase().includes(query) ||
				product.description?.toLowerCase().includes(query) === true ||
				product.ingredients?.toLowerCase().includes(query) === true;
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "available" && product.available) ||
				(statusFilter === "unavailable" && !product.available);

			return matchesSearch && matchesStatus;
		});
	}, [products, searchQuery, statusFilter]);

	const resetFilters = React.useCallback(() => {
		setSearchQuery("");
		setSelectedCategory("Todos");
		setStatusFilter("all");
	}, []);

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

				<ProductCreateForm categories={initialCategories} />
			</div>

			{error && (
				<div role="alert" className="text-destructive text-sm">
					{error}
				</div>
			)}

			<AdminProductStats products={products} categories={initialCategories} />

			<AdminProductFilters
				searchQuery={searchQuery}
				selectedCategory={selectedCategory}
				statusFilter={statusFilter}
				categories={initialCategories}
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
