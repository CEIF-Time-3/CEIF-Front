"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Eye } from "lucide-react";
import React from "react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { OrderCancelDialog } from "@/features/orders/components/order-cancel-dialog";
import { formatOrderDateTime } from "@/features/orders/components/order-details-dialog";
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

interface AdminOrderTableProps {
	orders: Order[];
	isLoading?: boolean;
	itemsPerPage?: number;
	onResetFilters?: () => void;
	onViewOrder: (orderId: string) => void;
	onUpdateStatus: (
		orderId: string,
		nextStatus: OrderStatus,
	) => Promise<unknown>;
}

export const AdminOrderTable = ({
	orders,
	isLoading = false,
	itemsPerPage = 6,
	onResetFilters,
	onViewOrder,
	onUpdateStatus,
}: AdminOrderTableProps) => {
	const columns = React.useMemo<ColumnDef<Order>[]>(
		() => [
			{
				id: "orderCode",
				header: "Pedido",
				cell: ({ row }) => {
					const order = row.original;
					return (
						<div className="flex flex-col gap-0.5">
							<span className="text-foreground text-sm font-bold">
								{order.code}
							</span>
							<span className="text-muted-foreground text-xs">
								{formatOrderDateTime(order.createdAt)}
							</span>
						</div>
					);
				},
			},
			{
				id: "customer",
				header: "Cliente / Entrega",
				cell: ({ row }) => {
					const order = row.original;
					return (
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-2">
								<span className="text-foreground text-sm font-semibold">
									{order.customerName}
								</span>
								<OrderDeliveryBadge deliveryType={order.deliveryType} />
							</div>
							<span className="text-muted-foreground text-xs">
								{order.customerPhone}
								{order.deliveryType === "delivery" && order.address
									? ` • ${order.address.neighborhood}`
									: ""}
							</span>
						</div>
					);
				},
			},
			{
				id: "itemsSummary",
				header: "Itens",
				cell: ({ row }) => {
					const order = row.original;
					const totalQuantity = order.items.reduce(
						(acc, item) => acc + item.quantity,
						0,
					);
					const firstItem = order.items[0];
					const remainingItemsCount = order.items.length - 1;

					return (
						<div className="flex max-w-64 flex-col gap-0.5">
							<span className="text-foreground truncate text-xs font-medium">
								{firstItem
									? `${firstItem.quantity}x ${firstItem.name}`
									: "Sem itens"}
							</span>
							<span className="text-muted-foreground text-xs">
								{remainingItemsCount > 0
									? `+ ${remainingItemsCount} ${remainingItemsCount === 1 ? "outro item" : "outros itens"} (${totalQuantity} un.)`
									: `${totalQuantity} ${totalQuantity === 1 ? "unidade" : "unidades"}`}
							</span>
						</div>
					);
				},
			},
			{
				id: "paymentAndTotal",
				header: "Total / Pagamento",
				cell: ({ row }) => {
					const order = row.original;
					const paymentConfig = PAYMENT_METHOD_CONFIG[order.paymentMethod];
					const PaymentIcon = paymentConfig.icon;

					return (
						<div className="flex flex-col gap-0.5">
							<span className="text-foreground text-sm font-bold">
								{formatPrice(order.total)}
							</span>
							<span className="text-muted-foreground flex items-center gap-1 text-xs">
								<PaymentIcon className="size-3" />
								<span>{paymentConfig.label}</span>
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
			},
			{
				id: "actions",
				header: () => <div className="text-right">Ações</div>,
				cell: ({ row }) => {
					const order = row.original;
					const statusConfig = ORDER_STATUS_CONFIG[order.status];
					const canCancel =
						order.status !== "completed" && order.status !== "cancelled";

					return (
						<div className="flex items-center justify-end gap-1.5">
							{statusConfig.nextStatus && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									title={statusConfig.nextLabel}
									onClick={() =>
										statusConfig.nextStatus &&
										void onUpdateStatus(order.id, statusConfig.nextStatus)
									}
									className="h-8 gap-1 text-xs"
								>
									<span>{statusConfig.nextLabel}</span>
									<ArrowRight className="size-3.5" />
								</Button>
							)}

							<Button
								type="button"
								variant="ghost"
								size="icon"
								title="Ver detalhes do pedido"
								onClick={() => onViewOrder(order.id)}
								className="text-muted-foreground hover:text-foreground size-8"
							>
								<Eye className="size-4" />
							</Button>

							{canCancel && (
								<OrderCancelDialog
									order={order}
									onConfirmCancel={onUpdateStatus}
								/>
							)}
						</div>
					);
				},
			},
		],
		[onUpdateStatus, onViewOrder],
	);

	return (
		<DataTable
			columns={columns}
			data={orders}
			isLoading={isLoading}
			pageSize={itemsPerPage}
			emptyMessage="Nenhum pedido encontrado correspondente aos filtros selecionados."
			onResetFilters={onResetFilters}
		/>
	);
};
