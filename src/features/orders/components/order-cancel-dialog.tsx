"use client";

import { Ban } from "lucide-react";
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
import type {
	Order,
	OrderStatus,
} from "@/features/orders/schemas/orders.schema";

interface OrderCancelDialogProps {
	order: Order;
	onConfirmCancel: (
		orderId: string,
		nextStatus: OrderStatus,
	) => Promise<unknown>;
}

export const OrderCancelDialog = ({
	order,
	onConfirmCancel,
}: OrderCancelDialogProps) => {
	const [open, setOpen] = React.useState(false);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleCancelOrder = async () => {
		setIsSubmitting(true);
		await onConfirmCancel(order.id, "cancelled");
		setIsSubmitting(false);
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!isSubmitting) {
					setOpen(nextOpen);
				}
			}}
		>
			<DialogTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						size="icon"
						title="Cancelar pedido"
						className="text-muted-foreground hover:text-destructive size-8"
					>
						<Ban className="size-4" />
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancelar pedido {order.code}?</DialogTitle>
					<DialogDescription>
						{`Tem certeza que deseja cancelar o pedido de "${order.customerName}"? O status será alterado para Cancelado.`}
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting}
						onClick={() => setOpen(false)}
					>
						Voltar
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={isSubmitting}
						onClick={() => void handleCancelOrder()}
					>
						{isSubmitting ? "Cancelando..." : "Confirmar cancelamento"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
