"use client";

import {
	CheckCircle2,
	DollarSign,
	FolderTree,
	Package,
	XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/features/products/schemas/product-schema";
import { formatPrice } from "@/utils/format-price";

interface AdminProductStatsProps {
	products: Product[];
	categories: string[];
}

export const AdminProductStats = ({
	products,
	categories,
}: AdminProductStatsProps) => {
	const totalProducts = products.length;
	const activeProducts = products.filter((p) => p.isAvailable).length;
	const inactiveProducts = products.filter((p) => !p.isAvailable).length;
	const totalCategories = categories.filter((c) => c !== "Todos").length;
	const averagePrice =
		totalProducts > 0
			? products.reduce((acc, p) => acc + p.price, 0) / totalProducts
			: 0;

	const stats = [
		{
			title: "Total de Produtos",
			value: totalProducts,
			description: "Cadastrados no sistema",
			icon: Package,
			iconBg: "bg-primary/15 text-primary",
		},
		{
			title: "Produtos Ativos",
			value: activeProducts,
			description: "Visíveis no cardápio",
			icon: CheckCircle2,
			iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
		},
		{
			title: "Indisponíveis",
			value: inactiveProducts,
			description: "Pausados no momento",
			icon: XCircle,
			iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
		},
		{
			title: "Categorias",
			value: totalCategories,
			description: "Grupos de produtos",
			icon: FolderTree,
			iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
		},
		{
			title: "Preço Médio",
			value: formatPrice(averagePrice),
			description: "Média por item",
			icon: DollarSign,
			iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full min-w-0">
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<Card
						key={stat.title}
						className="shadow-xs border-border bg-card w-full min-w-0 overflow-hidden"
					>
						<CardContent className="p-4 sm:p-5">
							<div className="flex items-center justify-between gap-2 min-w-0">
								<span
									className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block truncate min-w-0"
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
							<div className="mt-2 flex items-baseline gap-2 min-w-0">
								<span className="text-2xl font-bold tracking-tight text-foreground truncate min-w-0">
									{stat.value}
								</span>
							</div>
							<p className="mt-1 text-xs text-muted-foreground truncate">
								{stat.description}
							</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
};
