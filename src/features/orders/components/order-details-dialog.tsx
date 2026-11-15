"use client";

import {
	CalendarClock,
	MapPin,
	MessageSquareText,
	Phone,
	Receipt,
	User,
} from "lucide-react";
import Image from "next/image";
import React from "react";

import { SelectInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	ORDER_STATUS_CONFIG,
	OrderDeliveryBadge,
	OrderStatusBadge,
	PAYMENT_METHOD_CONFIG,
} from "@/features/orders/components/order-status-badge";
import type {
	Order,
	OrderStatus,
} from "@/features/orders/schemas/orders.schema";
import { formatPrice } from "@/utils/format-price";

interface OrderDetailsDialogProps {
	order: Order | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdateStatus: (
		orderId: string,
		nextStatus: OrderStatus,
	) => Promise<unknown>;
}

const statusSelectOptions = [
	{ label: "Pendente", value: "pending" },
	{ label: "Em Preparo", value: "preparing" },
	{ label: "Pronto / Saiu para Entrega", value: "ready" },
	{ label: "Concluído", value: "completed" },
	{ label: "Cancelado", value: "cancelled" },
];

export const formatOrderDateTime = (isoDate: string): string => {
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) {
		return isoDate;
	}
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(parsed);
};

export const OrderDetailsDialog = ({
	order,
	open,
	onOpenChange,
	onUpdateStatus,
}: OrderDetailsDialogProps) => {
	const [isUpdating, setIsUpdating] = React.useState(false);

	if (!order) {
		return null;
	}

	const paymentConfig = PAYMENT_METHOD_CONFIG[order.paymentMethod];
	const PaymentIcon = paymentConfig.icon;
	const statusConfig = ORDER_STATUS_CONFIG[order.status];

	const handleStatusChange = async (newStatus: OrderStatus) => {
		if (newStatus === order.status) return;
		setIsUpdating(true);
		await onUpdateStatus(order.id, newStatus);
		setIsUpdating(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<div className="flex flex-wrap items-center justify-between gap-2 pr-6">
						<div className="flex items-center gap-2">
							<DialogTitle className="text-lg font-extrabold">
								Pedido {order.code}
							</DialogTitle>
							<OrderStatusBadge status={order.status} />
							<OrderDeliveryBadge deliveryType={order.deliveryType} />
						</div>
					</div>
					<DialogDescription className="flex items-center gap-1.5 text-xs">
						<CalendarClock className="size-3.5" />
						<span>Realizado em {formatOrderDateTime(order.createdAt)}</span>
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-2">
					{/* Dados do Cliente e Entrega */}
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="border-border bg-muted/40 flex flex-col gap-2 rounded-xl border p-3.5">
							<div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold uppercase">
								<User className="size-3.5" />
								<span>Cliente</span>
							</div>
							<p className="text-foreground text-sm font-bold">
								{order.customerName}
							</p>
							<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
								<Phone className="size-3.5" />
								<span>{order.customerPhone}</span>
							</div>
						</div>

						<div className="border-border bg-muted/40 flex flex-col gap-2 rounded-xl border p-3.5">
							<div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold uppercase">
								<MapPin className="size-3.5" />
								<span>
									{order.deliveryType === "delivery"
										? "Endereço de Entrega"
										: "Modalidade de Retirada"}
								</span>
							</div>
							{order.deliveryType === "delivery" && order.address ? (
								<div className="flex flex-col gap-0.5 text-xs">
									<span className="text-foreground font-semibold">
										{order.address.street}, {order.address.number}
									</span>
									<span className="text-muted-foreground">
										Bairro: {order.address.neighborhood}
									</span>
									{order.address.complement && (
										<span className="text-muted-foreground">
											Compl.: {order.address.complement}
										</span>
									)}
								</div>
							) : (
								<p className="text-foreground text-xs font-medium">
									Cliente retirará o pedido diretamente no balcão da loja.
								</p>
							)}
						</div>
					</div>

					{/* Observação geral do pedido */}
					{order.observation && (
						<div className="border-amber-500/30 bg-amber-500/10 flex items-start gap-2.5 rounded-xl border p-3 text-xs">
							<MessageSquareText className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
							<div className="flex flex-col gap-0.5">
								<span className="font-semibold text-amber-800 dark:text-amber-300">
									Observação do Pedido:
								</span>
								<span className="text-foreground/90">{order.observation}</span>
							</div>
						</div>
					)}

					{/* Lista de Itens */}
					<div className="flex flex-col gap-2.5">
						<div className="flex items-center justify-between">
							<h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
								Itens do Pedido (
								{order.items.reduce((acc, i) => acc + i.quantity, 0)})
							</h4>
						</div>

						<div className="border-border divide-border divide-y rounded-xl border">
							{order.items.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between gap-3 p-3"
								>
									<div className="flex min-w-0 items-center gap-3">
										<div className="border-border bg-muted relative size-11 shrink-0 overflow-hidden rounded-lg border">
											{item.imageUrl ? (
												<Image
													src={item.imageUrl}
													alt={item.name}
													fill
													sizes="44px"
													className="object-cover"
												/>
											) : (
												<div className="text-muted-foreground flex size-full items-center justify-center text-[10px]">
													Item
												</div>
											)}
										</div>
										<div className="flex min-w-0 flex-col gap-0.5">
											<span className="text-foreground truncate text-sm font-semibold">
												{item.quantity}x {item.name}
											</span>
											<span className="text-muted-foreground text-xs">
												Unitário: {formatPrice(item.unitPrice)}
											</span>
											{item.observation && (
												<span className="text-amber-700 dark:text-amber-400 text-xs font-medium">
													Obs: {item.observation}
												</span>
											)}
										</div>
									</div>

									<span className="text-foreground shrink-0 text-sm font-bold">
										{formatPrice(item.quantity * item.unitPrice)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Resumo Financeiro e Pagamento */}
					<div className="border-border bg-muted/30 flex flex-col gap-2.5 rounded-xl border p-3.5">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground flex items-center gap-1.5 font-medium">
								<Receipt className="size-3.5" />
								Forma de Pagamento:
							</span>
							<span className="text-foreground flex items-center gap-1.5 font-semibold">
								<PaymentIcon className="size-3.5" />
								{paymentConfig.label}
								{order.changeFor ? ` (Troco para ${order.changeFor})` : ""}
							</span>
						</div>

						<Separator />

						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Subtotal dos itens</span>
							<span className="text-foreground font-medium">
								{formatPrice(order.subtotal)}
							</span>
						</div>
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Taxa de entrega</span>
							<span className="text-foreground font-medium">
								{order.deliveryFee === 0
									? "Grátis"
									: formatPrice(order.deliveryFee)}
							</span>
						</div>
						{order.discount > 0 && (
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground">Desconto</span>
								<span className="text-emerald-600 dark:text-emerald-400 font-medium">
									- {formatPrice(order.discount)}
								</span>
							</div>
						)}

						<Separator />

						<div className="flex items-center justify-between">
							<span className="text-foreground text-sm font-bold">
								Total do Pedido
							</span>
							<span className="text-foreground text-base font-extrabold">
								{formatPrice(order.total)}
							</span>
						</div>
					</div>

					{/* Alteração de Status */}
					<div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-3.5 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col gap-0.5">
							<span className="text-foreground text-xs font-bold">
								Atualizar Status do Pedido
							</span>
							<span className="text-muted-foreground text-xs">
								Selecione o novo status para acompanhar o fluxo na cozinha.
							</span>
						</div>
						<div className="w-full sm:w-56">
							<SelectInput
								size="sm"
								value={order.status}
								disabled={isUpdating}
								onValueChange={(val) =>
									void handleStatusChange(val as OrderStatus)
								}
								options={statusSelectOptions}
							/>
						</div>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Fechar
					</Button>
					{statusConfig.nextStatus && (
						<Button
							type="button"
							disabled={isUpdating}
							onClick={() =>
								statusConfig.nextStatus &&
								void handleStatusChange(statusConfig.nextStatus)
							}
						>
							{statusConfig.nextLabel}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
