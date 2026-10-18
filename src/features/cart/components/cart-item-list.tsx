import { ArrowLeft, Sparkles, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CartItemCard } from "@/features/cart/components/cart-item-card";
import { FREE_DELIVERY_THRESHOLD } from "@/features/cart/hooks/use-cart";
import type { CartItem } from "@/features/cart/schemas/cart.schema";
import { formatPrice } from "@/utils";

interface CartItemListProps {
	items: CartItem[];
	totalItems: number;
	subtotal: number;
	remainingForFreeDelivery: number;
	onUpdateQuantity: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
	onUpdateObservation: (id: string, observation: string) => void;
	onClearCart: () => void;
}

export const CartItemList = ({
	items,
	totalItems,
	subtotal,
	remainingForFreeDelivery,
	onUpdateQuantity,
	onRemove,
	onUpdateObservation,
	onClearCart,
}: CartItemListProps) => {
	const [isClearDialogOpen, setIsClearDialogOpen] = React.useState(false);

	const freeShippingPercent = React.useMemo(() => {
		return Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
	}, [subtotal]);

	const handleConfirmClear = React.useCallback(() => {
		onClearCart();
		setIsClearDialogOpen(false);
	}, [onClearCart]);

	return (
		<div className="flex flex-col gap-6">
			{/* Free Shipping Tracker */}
			<div className="border-border/80 bg-card/80 overflow-hidden rounded-2xl border p-4 shadow-xs">
				<div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
					<div className="flex items-center gap-2">
						<div className="bg-primary/20 text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full">
							{freeShippingPercent >= 100 ? (
								<Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
							) : (
								<Truck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
							)}
						</div>
						<span className="text-foreground font-semibold">
							{freeShippingPercent >= 100 ? (
								<span className="text-primary font-bold">
									Parabéns! Você ganhou Entrega Grátis! 🎉
								</span>
							) : (
								<span>
									Faltam apenas{" "}
									<strong className="text-primary font-extrabold">
										{formatPrice(remainingForFreeDelivery)}
									</strong>{" "}
									para entrega grátis
								</span>
							)}
						</span>
					</div>
					<span className="text-muted-foreground text-xs font-bold">
						{freeShippingPercent}%
					</span>
				</div>

				{/* Progress Track */}
				<div className="bg-muted mt-3 h-2 w-full overflow-hidden rounded-full">
					<div
						className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
						style={{ width: `${freeShippingPercent}%` }}
					/>
				</div>
			</div>

			{/* List Header */}
			<div className="flex items-center justify-between border-b pb-3">
				<div>
					<h2 className="text-foreground text-xl font-extrabold tracking-tight sm:text-2xl">
						Itens no Pedido
					</h2>
					<p className="text-muted-foreground text-xs sm:text-sm">
						{totalItems} {totalItems === 1 ? "item selecionado" : "itens selecionados"}
					</p>
				</div>

				{/* Clear Cart with Dialog */}
				<Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
					<DialogTrigger
						render={
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-destructive gap-1.5 text-xs font-semibold"
							>
								<Trash2 className="h-3.5 w-3.5" />
								<span>Esvaziar carrinho</span>
							</Button>
						}
					/>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Esvaziar carrinho?</DialogTitle>
							<DialogDescription>
								Tem certeza que deseja remover todos os itens do seu carrinho?
								Essa ação não pode ser revertida.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsClearDialogOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								type="button"
								variant="destructive"
								onClick={handleConfirmClear}
							>
								Sim, esvaziar
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Stack of Cart Items */}
			<div className="flex flex-col gap-3">
				{items.map((item) => (
					<CartItemCard
						key={item.id}
						item={item}
						onUpdateQuantity={onUpdateQuantity}
						onRemove={onRemove}
						onUpdateObservation={onUpdateObservation}
					/>
				))}
			</div>

			{/* Back to Menu Link */}
			<div className="pt-2">
				<Link
					href="/"
					className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm font-bold transition-colors hover:underline"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>Adicionar mais sabores do cardápio</span>
				</Link>
			</div>
		</div>
	);
};
