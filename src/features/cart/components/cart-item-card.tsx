import { Check, MessageSquare, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CartItem } from "@/features/cart/schemas/cart.schema";
import { formatPrice } from "@/utils";

interface CartItemCardProps {
	item: CartItem;
	onUpdateQuantity: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
	onUpdateObservation: (id: string, observation: string) => void;
}

export const CartItemCard = ({
	item,
	onUpdateQuantity,
	onRemove,
	onUpdateObservation,
}: CartItemCardProps) => {
	const [isEditingNote, setIsEditingNote] = React.useState(false);
	const [noteText, setNoteText] = React.useState(item.observation || "");

	const handleSaveNote = React.useCallback(() => {
		onUpdateObservation(item.id, noteText);
		setIsEditingNote(false);
	}, [item.id, noteText, onUpdateObservation]);

	const itemTotal = React.useMemo(() => {
		return item.unitPrice * item.quantity;
	}, [item.unitPrice, item.quantity]);

	return (
		<div className="border-border/80 bg-card hover:border-primary/40 relative flex flex-col gap-4 rounded-xl border p-4 shadow-2xs transition-all duration-200 sm:p-5">
			<div className="flex items-start gap-4">
				{/* Thumbnail */}
				<div className="bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
					{item.imageUrl ? (
						<Image
							src={item.imageUrl}
							alt={item.name}
							fill
							sizes="96px"
							className="object-cover"
						/>
					) : (
						<div className="text-muted-foreground flex h-full w-full items-center justify-center text-xs">
							Sem foto
						</div>
					)}
				</div>

				{/* Item Details */}
				<div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
					<div className="flex items-start justify-between gap-2">
						<div>
							<h3 className="text-foreground line-clamp-1 text-base font-bold sm:text-lg">
								{item.name}
							</h3>
							<p className="text-muted-foreground text-xs sm:text-sm">
								Preço unitário:{" "}
								<span className="font-semibold text-foreground/80">
									{formatPrice(item.unitPrice)}
								</span>
							</p>
						</div>

						{/* Remove Button */}
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={() => onRemove(item.id)}
							className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 transition-colors"
							title="Remover item"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>

					{/* Observation Badge / Toggle */}
					{item.observation && !isEditingNote && (
						<div className="bg-muted/70 text-muted-foreground mt-1 flex items-center justify-between gap-2 rounded-md px-2.5 py-1 text-xs">
							<span className="line-clamp-1 italic">
								&ldquo;{item.observation}&rdquo;
							</span>
							<button
								type="button"
								onClick={() => {
									setNoteText(item.observation || "");
									setIsEditingNote(true);
								}}
								className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-semibold hover:underline"
							>
								<Pencil className="h-3 w-3" />
								Editar
							</button>
						</div>
					)}

					{!item.observation && !isEditingNote && (
						<button
							type="button"
							onClick={() => setIsEditingNote(true)}
							className="text-muted-foreground hover:text-foreground mt-1 inline-flex w-fit items-center gap-1 text-xs transition-colors"
						>
							<MessageSquare className="h-3 w-3" />
							<span>Adicionar observação</span>
						</button>
					)}
				</div>
			</div>

			{/* Inline Observation Editor */}
			{isEditingNote && (
				<div className="border-border/60 bg-muted/40 flex items-center gap-2 rounded-lg border p-2">
					<Input
						value={noteText}
						onChange={(e) => setNoteText(e.target.value)}
						placeholder="Ex: sem cebola, bem assadinho..."
						maxLength={200}
						className="h-8 text-xs"
						autoFocus
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleSaveNote();
							}
						}}
					/>
					<Button
						type="button"
						size="sm"
						onClick={handleSaveNote}
						className="h-8 gap-1 px-3 text-xs font-semibold"
					>
						<Check className="h-3.5 w-3.5" />
						Salvar
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => setIsEditingNote(false)}
						className="h-8 px-2 text-xs"
					>
						Cancelar
					</Button>
				</div>
			)}

			{/* Bottom Bar: Quantity Controls and Total */}
			<div className="border-border/60 flex items-center justify-between border-t pt-3">
				{/* Quantity Stepper */}
				<div className="border-border bg-background flex items-center rounded-lg border shadow-2xs">
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
						disabled={item.quantity <= 1}
						className="text-foreground hover:bg-muted disabled:opacity-30 size-7 rounded-none rounded-l-lg"
						title="Diminuir quantidade"
					>
						<Minus className="h-3.5 w-3.5" />
					</Button>

					<span className="text-foreground min-w-8 text-center text-xs font-bold sm:min-w-10 sm:text-sm">
						{item.quantity}
					</span>

					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
						className="text-foreground hover:bg-muted size-7 rounded-none rounded-r-lg"
						title="Aumentar quantidade"
					>
						<Plus className="h-3.5 w-3.5" />
					</Button>
				</div>

				{/* Item Line Total */}
				<div className="flex items-baseline gap-1.5">
					<span className="text-muted-foreground text-xs">Total:</span>
					<span className="text-foreground text-base font-extrabold sm:text-lg">
						{formatPrice(itemTotal)}
					</span>
				</div>
			</div>
		</div>
	);
};
