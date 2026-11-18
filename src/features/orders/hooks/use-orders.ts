"use client";

import React from "react";
import type {
	DeliveryType,
	Order,
	OrderStatus,
} from "@/features/orders/schemas/orders.schema";
import { useOrderStore } from "@/features/orders/stores/order.store";
import { ordersService } from "@/services/orders.service";

export type OrderStatusFilter = "all" | OrderStatus;
export type OrderDeliveryFilter = "all" | DeliveryType;

export const useOrders = (initialOrders?: Order[]) => {
	const orders = useOrderStore((state) => state.orders);
	const isLoading = useOrderStore((state) => state.isLoading);
	const error = useOrderStore((state) => state.error);
	const setOrders = useOrderStore((state) => state.setOrders);
	const setLoading = useOrderStore((state) => state.setLoading);
	const setError = useOrderStore((state) => state.setError);
	const updateStatusInStore = useOrderStore(
		(state) => state.updateStatusInStore,
	);

	const [searchQuery, setSearchQuery] = React.useState("");
	const [statusFilter, setStatusFilter] =
		React.useState<OrderStatusFilter>("all");
	const [deliveryFilter, setDeliveryFilter] =
		React.useState<OrderDeliveryFilter>("all");
	const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(
		null,
	);

	React.useEffect(() => {
		if (initialOrders && initialOrders.length > 0) {
			setOrders(initialOrders);
		}
	}, [initialOrders, setOrders]);

	const refreshOrders = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		const result = await ordersService.getAll();
		setLoading(false);

		if (result.success) {
			setOrders(result.data);
		} else {
			setError(result.error);
		}
		return result;
	}, [setError, setLoading, setOrders]);

	const handleUpdateStatus = React.useCallback(
		async (orderId: string, nextStatus: OrderStatus) => {
			setError(null);
			const result = await ordersService.updateStatus(orderId, nextStatus);
			if (result.success) {
				updateStatusInStore(orderId, result.data.status);
			} else {
				setError(result.error);
			}
			return result;
		},
		[setError, updateStatusInStore],
	);

	const filteredOrders = React.useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return orders.filter((order) => {
			const matchesSearch =
				query === "" ||
				order.code.toLowerCase().includes(query) ||
				order.customerName.toLowerCase().includes(query) ||
				order.customerPhone.toLowerCase().includes(query) ||
				order.items.some((item) => item.name.toLowerCase().includes(query));

			const matchesStatus =
				statusFilter === "all" || order.status === statusFilter;

			const matchesDelivery =
				deliveryFilter === "all" || order.deliveryType === deliveryFilter;

			return matchesSearch && matchesStatus && matchesDelivery;
		});
	}, [orders, searchQuery, statusFilter, deliveryFilter]);

	const selectedOrder = React.useMemo(
		() => orders.find((order) => order.id === selectedOrderId) ?? null,
		[orders, selectedOrderId],
	);

	const resetFilters = React.useCallback(() => {
		setSearchQuery("");
		setStatusFilter("all");
		setDeliveryFilter("all");
	}, []);

	return {
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
	};
};
