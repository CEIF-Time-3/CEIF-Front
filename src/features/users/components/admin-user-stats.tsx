"use client";

import {
	CheckCircle2,
	ShieldCheck,
	UserRound,
	Users,
	XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AdminUser } from "@/features/users/schemas/user.schema";

interface AdminUserStatsProps {
	users: AdminUser[];
}

export const AdminUserStats = ({ users }: AdminUserStatsProps) => {
	const totalUsers = users.length;
	const activeUsers = users.filter((u) => u.status === "active").length;
	const inactiveUsers = users.filter((u) => u.status === "inactive").length;
	const customerUsers = users.filter((u) => u.role === "cliente").length;
	const adminUsers = users.filter((u) => u.role === "admin").length;

	const stats = [
		{
			title: "Total de Usuários",
			value: totalUsers,
			description: "Contas registradas",
			icon: Users,
			iconBg: "bg-primary/15 text-primary",
		},
		{
			title: "Usuários Ativos",
			value: activeUsers,
			description: "Com acesso liberado",
			icon: CheckCircle2,
			iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
		},
		{
			title: "Inativos",
			value: inactiveUsers,
			description: "Contas desativadas",
			icon: XCircle,
			iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
		},
		{
			title: "Clientes",
			value: customerUsers,
			description: "Compradores na loja",
			icon: UserRound,
			iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
		},
		{
			title: "Administradores",
			value: adminUsers,
			description: "Equipe de gestão",
			icon: ShieldCheck,
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
