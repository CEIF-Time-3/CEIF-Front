"use client";

import {
	ArrowRight,
	CheckCircle2,
	ShoppingBag,
	Utensils,
	X,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useCart } from "@/features/cart/hooks/use-cart";
import { ProductCategoryFilter } from "@/features/products/components/product-category-filter";
import { ProductList } from "@/features/products/components/product-list";
import { ProductSearch } from "@/features/products/components/product-search";
import { useProducts } from "@/features/products/hooks/use-products";
import type { Product } from "@/features/products/schemas/products.schema";
import { useCategorie } from "@/hooks/use-categorie";

interface ProductSectionProps {
	onAddToCart?: (product: Product) => void;
	initialProducts: Product[];
	initialCategories: { id: string; name: string }[];
}

export const ProductSection = ({
	onAddToCart,
	initialProducts,
	initialCategories,
}: ProductSectionProps) => {
	const [addedNotification, setAddedNotification] = React.useState<
		string | null
	>(null);

	const { addItem } = useCart();
	const { categories } = useCategorie(initialCategories);
	const {
		filteredProducts,
		categoriesOptions,
		isLoading,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		resetFilters,
	} = useProducts({
		initialProducts,
		categories,
		fallbackToMock: true,
	});

	const handleAddToCart = React.useCallback(
		(product: Product) => {
			if (onAddToCart) {
				onAddToCart(product);
			} else {
				addItem(product);
			}
			setAddedNotification(product.name);
		},
		[onAddToCart, addItem],
	);

	React.useEffect(() => {
		if (addedNotification) {
			const timer = setTimeout(() => {
				setAddedNotification(null);
			}, 3500);
			return () => clearTimeout(timer);
		}
	}, [addedNotification]);

	return (
		<section
			id="cardapio"
			className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
		>
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
						categories={categoriesOptions}
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
				onAddToCart={handleAddToCart}
				onResetFilters={resetFilters}
			/>

			{/* Floating Toast Notification on Add to Cart */}
			{addedNotification && (
				<div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary-foreground">
						<CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-bold text-foreground line-clamp-1">
							{addedNotification}
						</span>
						<span className="text-[11px] text-muted-foreground">
							Adicionado ao carrinho com sucesso!
						</span>
					</div>
					<Link
						href="/carrinho"
						className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs transition-colors hover:bg-primary/80"
					>
						<ShoppingBag className="h-3.5 w-3.5" />
						<span>Ver Carrinho</span>
						<ArrowRight className="h-3 w-3" />
					</Link>
					<button
						type="button"
						onClick={() => setAddedNotification(null)}
						className="text-muted-foreground hover:text-foreground ml-1 p-1"
						title="Fechar"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			)}
		</section>
	);
};
