"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

import { DataTable } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatUserDate } from "@/features/users/components/user-details-dialog";
import {
	UserRoleBadge,
	UserStatusBadge,
} from "@/features/users/components/user-role-badge";
import { UserStatusDialog } from "@/features/users/components/user-status-dialog";
import type {
	AdminUser,
	UserStatus,
} from "@/features/users/schemas/user.schema";

interface AdminUserTableProps {
	users: AdminUser[];
	isLoading?: boolean;
	itemsPerPage?: number;
	onResetFilters?: () => void;
	onViewUser: (userId: string) => void;
	onUpdateStatus: (userId: string, nextStatus: UserStatus) => Promise<unknown>;
}

export const AdminUserTable = ({
	users,
	isLoading = false,
	itemsPerPage = 6,
	onResetFilters,
	onViewUser,
	onUpdateStatus,
}: AdminUserTableProps) => {
	const columns = React.useMemo<ColumnDef<AdminUser>[]>(
		() => [
			{
				id: "userInfo",
				header: "Usuário",
				cell: ({ row }) => {
					const user = row.original;
					return (
						<div className="flex items-center gap-3">
							<Avatar className="border-border size-10 shrink-0 border">
								{user.avatarUrl && (
									<AvatarImage src={user.avatarUrl} alt={user.name} />
								)}
								<AvatarFallback className="bg-primary/20 text-foreground text-xs font-bold">
									{user.initials}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-0.5">
								<div className="flex items-center gap-1.5">
									<span className="text-foreground text-sm font-bold">
										{user.name}
									</span>
									<span className="text-muted-foreground font-mono text-xs">
										{user.code}
									</span>
								</div>
								<span className="text-muted-foreground text-xs">
									Desde {formatUserDate(user.createdAt)}
								</span>
							</div>
						</div>
					);
				},
			},
			{
				id: "contact",
				header: "Contato",
				cell: ({ row }) => {
					const user = row.original;
					return (
						<div className="flex flex-col gap-0.5">
							<span className="text-foreground flex items-center gap-1.5 text-xs font-medium">
								<Mail className="text-muted-foreground size-3.5 shrink-0" />
								<span className="truncate">{user.email}</span>
							</span>
							<span className="text-muted-foreground flex items-center gap-1.5 text-xs">
								<Phone className="size-3 shrink-0" />
								<span>{user.phone}</span>
							</span>
						</div>
					);
				},
			},
			{
				id: "location",
				header: "Endereço Principal",
				cell: ({ row }) => {
					const user = row.original;
					const primaryAddress =
						user.addresses.find((a) => a.isDefault) ?? user.addresses[0];

					if (!primaryAddress) {
						return (
							<span className="text-muted-foreground text-xs">
								Sem endereço
							</span>
						);
					}

					return (
						<div className="flex max-w-60 flex-col gap-0.5">
							<span className="text-foreground flex items-center gap-1 truncate text-xs font-medium">
								<MapPin className="text-muted-foreground size-3 shrink-0" />
								<span className="truncate">
									{primaryAddress.street}, {primaryAddress.number}
								</span>
							</span>
							<span className="text-muted-foreground truncate text-xs">
								{primaryAddress.neighborhood} • {primaryAddress.city}/
								{primaryAddress.state}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: "role",
				header: "Perfil",
				cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
			},
			{
				id: "actions",
				header: () => <div className="text-right">Ações</div>,
				cell: ({ row }) => {
					const user = row.original;
					return (
						<div className="flex items-center justify-end gap-1.5">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								title="Ver detalhes do usuário"
								onClick={() => onViewUser(user.id)}
								className="text-muted-foreground hover:text-foreground size-8"
							>
								<Eye className="size-4" />
							</Button>

							<UserStatusDialog
								user={user}
								onConfirmStatusChange={onUpdateStatus}
							/>
						</div>
					);
				},
			},
		],
		[onUpdateStatus, onViewUser],
	);

	return (
		<DataTable
			columns={columns}
			data={users}
			isLoading={isLoading}
			pageSize={itemsPerPage}
			emptyMessage="Nenhum usuário encontrado correspondente aos filtros selecionados."
			onResetFilters={onResetFilters}
		/>
	);
};
