"use client";

import { FilterX, Search, SlidersHorizontal } from "lucide-react";
import React from "react";

import { SelectInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
	OrderDeliveryFilter,
	OrderStatusFilter,
} from "@/features/orders/hooks/use-orders";
import type { Order } from "@/features/orders/schemas/orders.schema";
import { cn } from "@/lib/utils";

interface AdminOrderFiltersProps {
	orders: Order[];
	searchQuery: string;
	statusFilter: OrderStatusFilter;
	deliveryFilter: OrderDeliveryFilter;
	onSearchChange: (query: string) => void;
	onStatusFilterChange: (status: OrderStatusFilter) => void;
	onDeliveryFilterChange: (delivery: OrderDeliveryFilter) => void;
	onResetFilters: () => void;
}

const statusOptions = [
	{ label: "Todos os status", value: "all" },
	{ label: "Pendentes", value: "pending" },
	{ label: "Em Preparo", value: "preparing" },
	{ label: "Pronto / Saiu", value: "ready" },
	{ label: "Concluídos", value: "completed" },
	{ label: "Cancelados", value: "cancelled" },
];

const deliveryOptions = [
	{ label: "Todas as modalidades", value: "all" },
	{ label: "Entrega (Delivery)", value: "delivery" },
	{ label: "Retirada no Balcão", value: "takeaway" },
];

export const AdminOrderFilters = ({
	orders,
	searchQuery,
	statusFilter,
	deliveryFilter,
	onSearchChange,
	onStatusFilterChange,
	onDeliveryFilterChange,
	onResetFilters,
}: AdminOrderFiltersProps) => {
	const hasActiveFilters =
		searchQuery !== "" || statusFilter !== "all" || deliveryFilter !== "all";

	const statusCounts = React.useMemo(() => {
		return {
			all: orders.length,
			pending: orders.filter((o) => o.status === "pending").length,
			preparing: orders.filter((o) => o.status === "preparing").length,
			ready: orders.filter((o) => o.status === "ready").length,
			completed: orders.filter((o) => o.status === "completed").length,
			cancelled: orders.filter((o) => o.status === "cancelled").length,
		};
	}, [orders]);

	const quickTabs: {
		label: string;
		value: OrderStatusFilter;
		count: number;
	}[] = [
		{ label: "Todos", value: "all", count: statusCounts.all },
		{ label: "Pendentes", value: "pending", count: statusCounts.pending },
		{
			label: "Em Preparo",
			value: "preparing",
			count: statusCounts.preparing,
		},
		{ label: "Prontos / Rota", value: "ready", count: statusCounts.ready },
		{
			label: "Concluídos",
			value: "completed",
			count: statusCounts.completed,
		},
		{
			label: "Cancelados",
			value: "cancelled",
			count: statusCounts.cancelled,
		},
	];

	return (
		<div className="border-border bg-card/70 flex w-full min-w-0 flex-col gap-4 rounded-xl border p-4 shadow-xs backdrop-blur-xs">
			<div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="relative min-w-0 flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						type="text"
						placeholder="Buscar por código (#PED), cliente, telefone ou item..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="bg-background pl-9"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<SlidersHorizontal className="size-3.5 shrink-0" />
						<span className="hidden font-medium sm:inline">Modalidade:</span>
						<SelectInput
							size="sm"
							value={deliveryFilter}
							onValueChange={(val) =>
								onDeliveryFilterChange(val as OrderDeliveryFilter)
							}
							options={deliveryOptions}
							placeholder="Modalidade"
						/>
					</div>

					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<span className="hidden font-medium sm:inline">Status:</span>
						<SelectInput
							size="sm"
							value={statusFilter}
							onValueChange={(val) =>
								onStatusFilterChange(val as OrderStatusFilter)
							}
							options={statusOptions}
							placeholder="Status"
						/>
					</div>

					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onResetFilters}
							className="text-muted-foreground hover:text-foreground h-9 text-xs"
						>
							<FilterX className="mr-1.5 size-3.5" />
							Limpar
						</Button>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2 overflow-x-auto pb-1">
				{quickTabs.map((tab) => {
					const isActive = statusFilter === tab.value;
					return (
						<Button
							key={tab.value}
							type="button"
							variant={isActive ? "default" : "outline"}
							size="sm"
							onClick={() => onStatusFilterChange(tab.value)}
							className={cn(
								"h-8 shrink-0 gap-1.5 rounded-lg text-xs font-medium",
								!isActive && "bg-background/60 text-muted-foreground",
							)}
						>
							<span>{tab.label}</span>
							<span
								className={cn(
									"rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
									isActive
										? "bg-primary-foreground/20 text-primary-foreground"
										: "bg-muted text-foreground",
								)}
							>
								{tab.count}
							</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
};
