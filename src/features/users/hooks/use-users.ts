"use client";

import React from "react";
import type {
	AdminUser,
	UserRole,
	UserStatus,
} from "@/features/users/schemas/user.schema";
import { useUserStore } from "@/features/users/stores/user.store";
import { userService } from "@/services/user.service";

export type UserRoleFilter = "all" | UserRole;
export type UserStatusFilter = "all" | UserStatus;

export const useUsers = (initialUsers?: AdminUser[]) => {
	const users = useUserStore((state) => state.users);
	const isLoading = useUserStore((state) => state.isLoading);
	const error = useUserStore((state) => state.error);
	const setUsers = useUserStore((state) => state.setUsers);
	const setLoading = useUserStore((state) => state.setLoading);
	const setError = useUserStore((state) => state.setError);
	const updateStatusInStore = useUserStore(
		(state) => state.updateStatusInStore,
	);
	const updateRoleInStore = useUserStore((state) => state.updateRoleInStore);

	const [searchQuery, setSearchQuery] = React.useState("");
	const [roleFilter, setRoleFilter] = React.useState<UserRoleFilter>("all");
	const [statusFilter, setStatusFilter] =
		React.useState<UserStatusFilter>("all");
	const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
		null,
	);

	React.useEffect(() => {
		if (initialUsers && initialUsers.length > 0) {
			setUsers(initialUsers);
		}
	}, [initialUsers, setUsers]);

	const refreshUsers = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		const result = await userService.getAll();
		setLoading(false);

		if (result.success) {
			setUsers(result.data);
		} else {
			setError(result.error);
		}
		return result;
	}, [setError, setLoading, setUsers]);

	const handleUpdateStatus = React.useCallback(
		async (userId: string, nextStatus: UserStatus) => {
			setError(null);
			const result = await userService.updateStatus(userId, nextStatus);
			if (result.success) {
				updateStatusInStore(userId, result.data.status);
			} else {
				setError(result.error);
			}
			return result;
		},
		[setError, updateStatusInStore],
	);

	const handleUpdateRole = React.useCallback(
		async (userId: string, nextRole: UserRole) => {
			setError(null);
			const result = await userService.updateRole(userId, nextRole);
			if (result.success) {
				updateRoleInStore(userId, result.data.role);
			} else {
				setError(result.error);
			}
			return result;
		},
		[setError, updateRoleInStore],
	);

	const filteredUsers = React.useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return users.filter((user) => {
			const matchesSearch =
				query === "" ||
				user.code.toLowerCase().includes(query) ||
				user.name.toLowerCase().includes(query) ||
				user.email.toLowerCase().includes(query) ||
				user.phone.toLowerCase().includes(query) ||
				user.addresses.some(
					(addr) =>
						addr.neighborhood.toLowerCase().includes(query) ||
						addr.city.toLowerCase().includes(query) ||
						addr.street.toLowerCase().includes(query),
				);

			const matchesRole = roleFilter === "all" || user.role === roleFilter;
			const matchesStatus =
				statusFilter === "all" || user.status === statusFilter;

			return matchesSearch && matchesRole && matchesStatus;
		});
	}, [users, searchQuery, roleFilter, statusFilter]);

	const selectedUser = React.useMemo(
		() => users.find((user) => user.id === selectedUserId) ?? null,
		[users, selectedUserId],
	);

	const resetFilters = React.useCallback(() => {
		setSearchQuery("");
		setRoleFilter("all");
		setStatusFilter("all");
	}, []);

	return {
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
	};
};
