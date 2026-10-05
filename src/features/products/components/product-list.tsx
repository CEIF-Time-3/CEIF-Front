import { Frown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductListSkeleton } from "@/features/products/components/product-list-skeleton";
import type { Product } from "@/features/products/schemas/product-schema";

interface ProductListProps {
	products: Product[];
	isLoading?: boolean;
	onAddToCart?: (product: Product) => void;
	onResetFilters?: () => void;
}

export const ProductList = ({
	products,
	isLoading,
	onAddToCart,
	onResetFilters,
}: ProductListProps) => {
	if (isLoading) {
		return <ProductListSkeleton />;
	}

	if (products.length === 0) {
		return (
			<div className="border-border bg-muted/30 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center">
				<div className="bg-muted text-muted-foreground flex h-16 w-16 items-center justify-center rounded-full">
					<Frown className="h-8 w-8" />
				</div>
				<h3 className="text-foreground mt-4 text-xl font-bold">
					Nenhum produto encontrado
				</h3>
				<p className="text-muted-foreground mt-2 max-w-md text-sm">
					Não encontramos nenhum produto correspondente aos filtros aplicados.
					Tente buscar com outros termos ou selecione outra categoria.
				</p>
				{onResetFilters && (
					<Button
						variant="outline"
						onClick={onResetFilters}
						className="mt-6 gap-2 font-semibold"
					>
						<RefreshCw className="h-4 w-4" />
						Limpar Filtros
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					onAddToCart={onAddToCart}
				/>
			))}
		</div>
	);
};
