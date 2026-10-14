"use client";

import { Eye, EyeOff } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/features/products/schemas/products.schema";
import { useProductStore } from "@/features/products/stores/product.store";

interface ProductAvailabilityDialogProps {
	product: Product;
}

export const ProductAvailabilityDialog = ({
	product,
}: ProductAvailabilityDialogProps) => {
	const setAvailability = useProductStore((state) => state.setAvailability);
	const [open, setOpen] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const available = !product.available;

	const handleConfirm = async () => {
		setIsSubmitting(true);
		setError(null);
		const result = await setAvailability(product.id, available);
		setIsSubmitting(false);

		if (!result.success) {
			setError(result.error);
			return;
		}

		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!isSubmitting) {
					setOpen(nextOpen);
					if (!nextOpen) setError(null);
				}
			}}
		>
			<DialogTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						title={
							product.available
								? "Marcar como indisponível"
								: "Marcar como disponível"
						}
						className="text-muted-foreground hover:text-foreground size-8"
					>
						{product.available ? (
							<Eye className="size-4 text-emerald-600 dark:text-emerald-400" />
						) : (
							<EyeOff className="size-4 text-rose-500" />
						)}
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{available ? "Tornar produto disponível?" : "Ocultar produto?"}
					</DialogTitle>
					<DialogDescription>
						{`Confirma a alteração de disponibilidade de "${product.name}"?`}
					</DialogDescription>
				</DialogHeader>
				{error && (
					<p role="alert" className="text-destructive text-sm">
						{error}
					</p>
				)}
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting}
						onClick={() => setOpen(false)}
					>
						Cancelar
					</Button>
					<Button
						type="button"
						disabled={isSubmitting}
						onClick={() => void handleConfirm()}
					>
						{isSubmitting ? "Salvando..." : "Confirmar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
