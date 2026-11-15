"use client";

import { ClipboardList, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminOrderFilters } from "@/features/orders/components/admin-order-filters";
import { AdminOrderStats } from "@/features/orders/components/admin-order-stats";
import { AdminOrderTable } from "@/features/orders/components/admin-order-table";
import { OrderDetailsDialog } from "@/features/orders/components/order-details-dialog";
import { useOrders } from "@/features/orders/hooks/use-orders";
import type { Order } from "@/features/orders/schemas/orders.schema";

interface AdminOrderSectionProps {
	initialOrders?: Order[];
}

export const AdminOrderSection = ({
	initialOrders,
}: AdminOrderSectionProps) => {
	const {
		orders,
		filteredOrders,
		selectedOrder,
		selectedOrderId,
		setSelectedOrderId,
		isLoading,
		error,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		deliveryFilter,
		setDeliveryFilter,
		resetFilters,
		refreshOrders,
		handleUpdateStatus,
	} = useOrders(initialOrders);

	return (
		<div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 p-4 md:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
						<ClipboardList className="size-4" />
						<span>Painel de Administração</span>
					</div>
					<h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
						Gestão de Pedidos
					</h1>
					<p className="text-muted-foreground text-sm">
						Acompanhe, filtre e atualize o status dos pedidos de entrega e
						retirada em tempo real.
					</p>
				</div>

				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={isLoading}
					onClick={() => void refreshOrders()}
					className="gap-2 self-start sm:self-auto"
				>
					<RotateCcw className="size-4" />
					<span>Restaurar Mock</span>
				</Button>
			</div>

			{error && (
				<div role="alert" className="text-destructive text-sm">
					{error}
				</div>
			)}

			<AdminOrderStats orders={orders} />

			<AdminOrderFilters
				orders={orders}
				searchQuery={searchQuery}
				statusFilter={statusFilter}
				deliveryFilter={deliveryFilter}
				onSearchChange={setSearchQuery}
				onStatusFilterChange={setStatusFilter}
				onDeliveryFilterChange={setDeliveryFilter}
				onResetFilters={resetFilters}
			/>

			<AdminOrderTable
				orders={filteredOrders}
				isLoading={isLoading}
				onResetFilters={resetFilters}
				onViewOrder={(orderId) => setSelectedOrderId(orderId)}
				onUpdateStatus={handleUpdateStatus}
			/>

			<OrderDetailsDialog
				order={selectedOrder}
				open={Boolean(selectedOrderId)}
				onOpenChange={(open) => {
					if (!open) setSelectedOrderId(null);
				}}
				onUpdateStatus={handleUpdateStatus}
			/>
		</div>
	);
};
