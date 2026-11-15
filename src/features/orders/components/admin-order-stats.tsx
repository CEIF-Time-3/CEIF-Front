"use client";

import {
	CheckCircle2,
	Clock,
	DollarSign,
	Flame,
	ShoppingBag,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/features/orders/schemas/orders.schema";
import { formatPrice } from "@/utils/format-price";

interface AdminOrderStatsProps {
	orders: Order[];
}

export const AdminOrderStats = ({ orders }: AdminOrderStatsProps) => {
	const totalOrders = orders.length;
	const pendingOrders = orders.filter((o) => o.status === "pending").length;
	const inProgressOrders = orders.filter(
		(o) => o.status === "preparing" || o.status === "ready",
	).length;
	const completedOrders = orders.filter((o) => o.status === "completed").length;

	const totalRevenue = orders
		.filter((o) => o.status !== "cancelled")
		.reduce((acc, order) => acc + order.total, 0);

	const stats = [
		{
			title: "Total de Pedidos",
			value: totalOrders,
			description: "Registrados no turno",
			icon: ShoppingBag,
			iconBg: "bg-primary/15 text-primary",
		},
		{
			title: "Aguardando",
			value: pendingOrders,
			description: "Pendentes de aceite",
			icon: Clock,
			iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
		},
		{
			title: "Em Andamento",
			value: inProgressOrders,
			description: "Na cozinha ou em rota",
			icon: Flame,
			iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
		},
		{
			title: "Concluídos",
			value: completedOrders,
			description: "Finalizados com sucesso",
			icon: CheckCircle2,
			iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
		},
		{
			title: "Receita Estimada",
			value: formatPrice(totalRevenue),
			description: "Pedidos ativos e concluídos",
			icon: DollarSign,
			iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
		},
	];

	return (
		<div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<Card
						key={stat.title}
						className="border-border bg-card w-full min-w-0 overflow-hidden shadow-xs"
					>
						<CardContent className="p-4 sm:p-5">
							<div className="flex min-w-0 items-center justify-between gap-2">
								<span
									className="text-muted-foreground block min-w-0 truncate text-xs font-semibold tracking-wider uppercase"
									title={stat.title}
								>
									{stat.title}
								</span>
								<div
									className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
								>
									<Icon className="size-4" />
								</div>
							</div>
							<div className="mt-2 flex min-w-0 items-baseline gap-2">
								<span className="text-foreground min-w-0 truncate text-2xl font-bold tracking-tight">
									{stat.value}
								</span>
							</div>
							<p className="text-muted-foreground mt-1 truncate text-xs">
								{stat.description}
							</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
};
