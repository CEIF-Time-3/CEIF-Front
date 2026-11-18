import type {
	CreateAdminUserPayload,
	CreateUserPayload,
} from "@/features/users/schemas/create-user.schema";
import {
	type AdminUser,
	type ApiUser,
	type UserRole,
	type UserStatus,
	updateUserRoleSchema,
	updateUserStatusSchema,
	usersResponseSchema,
} from "@/features/users/schemas/user.schema";
import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { http } from "@/utils/http";

export const formatUserInitials = (name: string): string => {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "US";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const mapApiUserToAdminUser = (
	user: ApiUser,
	index?: number,
): AdminUser => {
	const fallbackCode =
		index !== undefined
			? `#USR-${String(index + 1).padStart(3, "0")}`
			: `#USR-${user.id.slice(0, 4).toUpperCase()}`;

	const status: UserStatus = user.isActive ? "active" : "inactive";

	const role: UserRole = user.role === "admin" ? "admin" : "customer";

	return {
		id: user.id,
		code: user.code || fallbackCode,
		name: user.name,
		email: user.email,
		phone: user.phone || "",
		role,
		status,
		isActive: user.isActive,
		avatarUrl: user.avatarUrl ?? null,
		initials: formatUserInitials(user.name),
		addresses: user.addresses ?? [],
		createdAt: user.createdAt ?? new Date().toISOString(),
	};
};

export const getUsers = async (): Promise<Result<AdminUser[], string>> => {
	try {
		const data = await http<unknown>("/users");
		const parsedData = usersResponseSchema.parse(data);

		const mappedUsers = parsedData.data.map((user, index) =>
			mapApiUserToAdminUser(user, index),
		);

		return {
			success: true,
			data: mappedUsers,
		};
	} catch (error) {
		return {
			success: false,
			error: getErrorMessage(error),
		};
	}
};

export const updateUserStatus = async (
	userId: string,
	status: UserStatus,
): Promise<Result<{ userId: string; status: UserStatus }, string>> => {
	try {
		const parsed = updateUserStatusSchema.safeParse({ userId, status });
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
			};
		}

		return {
			success: true,
			data: parsed.data,
		};
	} catch (error) {
		return {
			success: false,
			error: getErrorMessage(error),
		};
	}
};

export const updateUserRole = async (
	userId: string,
	role: UserRole,
): Promise<Result<{ userId: string; role: UserRole }, string>> => {
	try {
		const parsed = updateUserRoleSchema.safeParse({ userId, role });
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
			};
		}

		return {
			success: true,
			data: parsed.data,
		};
	} catch (error) {
		return {
			success: false,
			error: getErrorMessage(error),
		};
	}
};

export const createUser = async (
	payload: CreateUserPayload | CreateAdminUserPayload,
): Promise<Result<string, string>> => {
	try {
		await http<unknown>("/users/register", {
			method: "POST",
			body: JSON.stringify(payload),
		});
		return { success: true, data: "Usuário criado com sucesso!" };
	} catch (error) {
		return { success: false, error: getErrorMessage(error) };
	}
};

export class UserService {
	async getAll(): Promise<Result<AdminUser[], string>> {
		return getUsers();
	}

	async updateStatus(
		userId: string,
		status: UserStatus,
	): Promise<Result<{ userId: string; status: UserStatus }, string>> {
		return updateUserStatus(userId, status);
	}

	async updateRole(
		userId: string,
		role: UserRole,
	): Promise<Result<{ userId: string; role: UserRole }, string>> {
		return updateUserRole(userId, role);
	}

	async createUser(
		payload: CreateUserPayload | CreateAdminUserPayload,
	): Promise<Result<string, string>> {
		return createUser(payload);
	}
}

export const userService = new UserService();
