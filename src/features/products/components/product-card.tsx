import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/features/products/schemas/product-schema";
import { formatPrice } from "@/utils";

interface ProductCardProps {
	product: Product;
	onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
	return (
		<Card className="group border-border/80 bg-card hover:border-primary/50 relative flex h-full flex-col justify-between overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
			<div className="bg-muted relative h-48 w-full overflow-hidden">
				{product.imageUrl ? (
					<Image
						src={product.imageUrl}
						alt={product.name}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
						Sem imagem
					</div>
				)}
			</div>

			<CardHeader className="p-5 pb-2">
				<CardTitle className="text-foreground group-hover:text-primary text-lg leading-snug font-bold transition-colors">
					{product.name}
				</CardTitle>
			</CardHeader>

			<CardContent className="flex-1 px-5 py-0">
				<CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
					{product.description}
				</CardDescription>
			</CardContent>

			<CardFooter className="border-border/50 flex items-center justify-between border-t bg-transparent p-5 pt-4">
				<div className="flex flex-col">
					<span className="text-muted-foreground text-xs">Preço</span>
					<span className="text-foreground text-xl font-extrabold tracking-tight">
						{formatPrice(product.price)}
					</span>
				</div>

				<Button
					size="sm"
					disabled={!product.isAvailable}
					onClick={() => onAddToCart?.(product)}
					className="h-10 gap-1.5 rounded-lg px-4 font-bold shadow-xs transition-all hover:shadow-md"
				>
					<Plus className="h-4 w-4" />
					<span>{product.isAvailable ? "Adicionar" : "Esgotado"}</span>
				</Button>
			</CardFooter>
		</Card>
	);
};
