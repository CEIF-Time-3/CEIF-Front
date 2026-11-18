"use client";

import { FilterX, Search, SlidersHorizontal } from "lucide-react";
import React from "react";

import { SelectInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
	UserRoleFilter,
	UserStatusFilter,
} from "@/features/users/hooks/use-users";
import type { AdminUser } from "@/features/users/schemas/user.schema";
import { cn } from "@/lib/utils";

interface AdminUserFiltersProps {
	users: AdminUser[];
	searchQuery: string;
	roleFilter: UserRoleFilter;
	statusFilter: UserStatusFilter;
	onSearchChange: (query: string) => void;
	onRoleFilterChange: (role: UserRoleFilter) => void;
	onStatusFilterChange: (status: UserStatusFilter) => void;
	onResetFilters: () => void;
}

const roleOptions = [
	{ label: "Todos os perfis", value: "all" },
	{ label: "Clientes", value: "customer" },
	{ label: "Administradores", value: "admin" },
];

const statusOptions = [
	{ label: "Todos os status", value: "all" },
	{ label: "Apenas Ativos", value: "active" },
	{ label: "Apenas Inativos", value: "inactive" },
];

export const AdminUserFilters = ({
	users,
	searchQuery,
	roleFilter,
	statusFilter,
	onSearchChange,
	onRoleFilterChange,
	onStatusFilterChange,
	onResetFilters,
}: AdminUserFiltersProps) => {
	const hasActiveFilters =
		searchQuery !== "" || roleFilter !== "all" || statusFilter !== "all";

	const counts = React.useMemo(() => {
		return {
			all: users.length,
			customer: users.filter(
				(u) => u.role === "customer" || (u.role as string) === "cliente",
			).length,
			admin: users.filter((u) => u.role === "admin").length,
		};
	}, [users]);

	const quickRoleTabs: {
		label: string;
		value: UserRoleFilter;
		count: number;
	}[] = [
		{ label: "Todos", value: "all", count: counts.all },
		{ label: "Clientes", value: "customer", count: counts.customer },
		{ label: "Administradores", value: "admin", count: counts.admin },
	];

	return (
		<div className="border-border bg-card/70 flex w-full min-w-0 flex-col gap-4 rounded-xl border p-4 shadow-xs backdrop-blur-xs">
			<div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="relative min-w-0 flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						type="text"
						placeholder="Buscar por nome, e-mail, código (#USR), telefone ou bairro..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="bg-background pl-9"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<SlidersHorizontal className="size-3.5 shrink-0" />
						<span className="hidden font-medium sm:inline">Perfil:</span>
						<SelectInput
							size="sm"
							value={roleFilter}
							onValueChange={(val) => onRoleFilterChange(val as UserRoleFilter)}
							options={roleOptions}
							placeholder="Perfil"
						/>
					</div>

					<div className="text-muted-foreground flex items-center gap-1.5 text-xs">
						<span className="hidden font-medium sm:inline">Status:</span>
						<SelectInput
							size="sm"
							value={statusFilter}
							onValueChange={(val) =>
								onStatusFilterChange(val as UserStatusFilter)
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
				{quickRoleTabs.map((tab) => {
					const isActive = roleFilter === tab.value;
					return (
						<Button
							key={tab.value}
							type="button"
							variant={isActive ? "default" : "outline"}
							size="sm"
							onClick={() => onRoleFilterChange(tab.value)}
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
