"use client";

import { Trash2 } from "lucide-react";
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

interface ProductDeleteDialogProps {
	product: Product;
}

export const ProductDeleteDialog = ({ product }: ProductDeleteDialogProps) => {
	const deleteProduct = useProductStore((state) => state.deleteProduct);
	const [open, setOpen] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleDelete = async () => {
		setIsSubmitting(true);
		setError(null);
		const result = await deleteProduct(product.id);
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
						title="Excluir produto"
						className="text-muted-foreground hover:text-destructive size-8"
					>
						<Trash2 className="size-4" />
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Excluir produto?</DialogTitle>
					<DialogDescription>
						{`Tem certeza que deseja excluir "${product.name}"? Esta ação não pode ser desfeita.`}
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
						variant="destructive"
						disabled={isSubmitting}
						onClick={() => void handleDelete()}
					>
						{isSubmitting ? "Excluindo..." : "Excluir produto"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
