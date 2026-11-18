"use client";

import { RotateCcw, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminUserFilters } from "@/features/users/components/admin-user-filters";
import { AdminUserStats } from "@/features/users/components/admin-user-stats";
import { AdminUserTable } from "@/features/users/components/admin-user-table";
import { UserCreateDialog } from "@/features/users/components/user-create-dialog";
import { UserDetailsDialog } from "@/features/users/components/user-details-dialog";
import { useUsers } from "@/features/users/hooks/use-users";
import type { AdminUser } from "@/features/users/schemas/user.schema";

interface AdminUserSectionProps {
	initialUsers?: AdminUser[];
}

export const AdminUserSection = ({ initialUsers }: AdminUserSectionProps) => {
	const {
		users,
		filteredUsers,
		selectedUser,
		selectedUserId,
		setSelectedUserId,
		isLoading,
		error,
		searchQuery,
		setSearchQuery,
		roleFilter,
		setRoleFilter,
		statusFilter,
		setStatusFilter,
		resetFilters,
		refreshUsers,
		handleUpdateStatus,
		handleUpdateRole,
	} = useUsers(initialUsers);

	return (
		<div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 p-4 md:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
						<Users className="size-4" />
						<span>Painel de Administração</span>
					</div>
					<h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
						Gestão de Usuários
					</h1>
					<p className="text-muted-foreground text-sm">
						Visualize, pesquise e gerencie contas de clientes e administradores
						da plataforma.
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isLoading}
						onClick={() => void refreshUsers()}
						className="gap-2 self-start sm:self-auto"
					>
						<RotateCcw className="size-4" />
						<span>Restaurar Mock</span>
					</Button>

					<UserCreateDialog />
				</div>
			</div>

			{error && (
				<div role="alert" className="text-destructive text-sm">
					{error}
				</div>
			)}

			<AdminUserStats users={users} />

			<AdminUserFilters
				users={users}
				searchQuery={searchQuery}
				roleFilter={roleFilter}
				statusFilter={statusFilter}
				onSearchChange={setSearchQuery}
				onRoleFilterChange={setRoleFilter}
				onStatusFilterChange={setStatusFilter}
				onResetFilters={resetFilters}
			/>

			<AdminUserTable
				users={filteredUsers}
				isLoading={isLoading}
				onResetFilters={resetFilters}
				onViewUser={(userId) => setSelectedUserId(userId)}
				onUpdateStatus={handleUpdateStatus}
			/>

			<UserDetailsDialog
				user={selectedUser}
				open={Boolean(selectedUserId)}
				onOpenChange={(open) => {
					if (!open) setSelectedUserId(null);
				}}
				onUpdateStatus={handleUpdateStatus}
				onUpdateRole={handleUpdateRole}
			/>
		</div>
	);
};
