"use client";

import { Utensils } from "lucide-react";
import { ProductCategoryFilter } from "@/features/products/components/product-category-filter";
import { ProductList } from "@/features/products/components/product-list";
import { ProductSearch } from "@/features/products/components/product-search";
import { useProducts } from "@/features/products/hooks/use-products";
import type { Product } from "@/features/products/schemas/product-schema";

interface ProductSectionProps {
	onAddToCart?: (product: Product) => void;
}

export const ProductSection = ({ onAddToCart }: ProductSectionProps) => {
	const {
		filteredProducts,
		categories,
		isLoading,
		searchQuery,
		selectedCategory,
		setSearchQuery,
		setSelectedCategory,
		resetFilters,
	} = useProducts();

	return (
		<section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-8 flex flex-col gap-2">
				<div className="text-primary flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
					<Utensils className="h-4 w-4" />
					<span>Nosso Cardápio</span>
				</div>
				<h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
					Explore nossos Sabores Irresistíveis
				</h2>
				<p className="text-muted-foreground max-w-2xl text-base">
					Pastéis fritos na hora com massa crocante e recheios caprichados.
					Escolha os seus favoritos!
				</p>
			</div>

			<div className="border-border bg-card/60 mb-8 flex flex-col gap-4 rounded-2xl border p-4 shadow-xs backdrop-blur-xs sm:p-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<ProductSearch value={searchQuery} onChange={setSearchQuery} />
				</div>

				<div className="border-border/50 border-t pt-2">
					<ProductCategoryFilter
						categories={categories}
						selectedCategory={selectedCategory}
						onSelectCategory={setSelectedCategory}
					/>
				</div>
			</div>

			<div className="text-muted-foreground mb-6 flex items-center justify-between text-sm">
				<span>
					Exibindo{" "}
					<strong className="text-foreground">{filteredProducts.length}</strong>{" "}
					{filteredProducts.length === 1 ? "produto" : "produtos"}
				</span>
				{(searchQuery || selectedCategory !== "Todos") && (
					<button
						type="button"
						onClick={resetFilters}
						className="text-primary cursor-pointer text-xs font-semibold hover:underline"
					>
						Limpar busca e filtros
					</button>
				)}
			</div>

			<ProductList
				products={filteredProducts}
				isLoading={isLoading}
				onAddToCart={onAddToCart}
				onResetFilters={resetFilters}
			/>
		</section>
	);
};
