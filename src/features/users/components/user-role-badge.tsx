"use client";

import { CheckCircle2, ShieldCheck, UserRound, XCircle } from "lucide-react";
import type React from "react";

import { Badge } from "@/components/ui/badge";
import type {
	UserRole,
	UserStatus,
} from "@/features/users/schemas/user.schema";
import { cn } from "@/lib/utils";

export const USER_ROLE_CONFIG: Record<
	UserRole,
	{
		label: string;
		badgeClassName: string;
		icon: React.ComponentType<{ className?: string }>;
	}
> = {
	admin: {
		label: "Administrador",
		badgeClassName:
			"border-purple-500/25 bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 dark:text-purple-400",
		icon: ShieldCheck,
	},
	customer: {
		label: "Cliente",
		badgeClassName:
			"border-blue-500/25 bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:text-blue-400",
		icon: UserRound,
	},
};

export const USER_STATUS_CONFIG: Record<
	UserStatus,
	{
		label: string;
		badgeClassName: string;
		icon: React.ComponentType<{ className?: string }>;
		nextStatus: UserStatus;
		nextLabel: string;
	}
> = {
	active: {
		label: "Ativo",
		badgeClassName:
			"border-emerald-500/25 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400",
		icon: CheckCircle2,
		nextStatus: "inactive",
		nextLabel: "Desativar conta",
	},
	inactive: {
		label: "Inativo",
		badgeClassName:
			"border-rose-500/25 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:text-rose-400",
		icon: XCircle,
		nextStatus: "active",
		nextLabel: "Reativar conta",
	},
};

interface UserRoleBadgeProps {
	role: UserRole | string;
	className?: string;
}

export const UserRoleBadge = ({ role, className }: UserRoleBadgeProps) => {
	const normalizedRole = role === "cliente" ? "customer" : role;
	const config = USER_ROLE_CONFIG[normalizedRole as UserRole] ?? {
		label: role,
		badgeClassName:
			"border-zinc-500/25 bg-zinc-500/15 text-zinc-700 hover:bg-zinc-500/25 dark:text-zinc-400",
		icon: UserRound,
	};
	const Icon = config.icon;

	return (
		<Badge
			variant="outline"
			className={cn("gap-1 font-semibold", config.badgeClassName, className)}
		>
			<Icon className="size-3.5" />
			<span>{config.label}</span>
		</Badge>
	);
};

interface UserStatusBadgeProps {
	status: UserStatus;
	className?: string;
}

export const UserStatusBadge = ({
	status,
	className,
}: UserStatusBadgeProps) => {
	const config = USER_STATUS_CONFIG[status];
	const Icon = config.icon;

	return (
		<Badge
			variant="default"
			className={cn("gap-1.5 font-semibold", config.badgeClassName, className)}
		>
			<Icon className="size-3.5" />
			<span>{config.label}</span>
		</Badge>
	);
};
