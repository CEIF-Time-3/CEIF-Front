import type {
	CreateAdminUserPayload,
	CreateUserPayload,
} from "@/features/users/schemas/create-user.schema";
import {
	type AdminUser,
	type UserRole,
	type UserStatus,
	updateUserRoleSchema,
	updateUserStatusSchema,
} from "@/features/users/schemas/user.schema";
import { MOCK_USERS } from "@/mocks/user";
import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { http } from "@/utils/http";

export const getUsers = async (): Promise<Result<AdminUser[], string>> => {
	try {
		return {
			success: true,
			data: [...MOCK_USERS],
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
		try {
			await http<unknown>("/users/register", {
				method: "POST",
				body: JSON.stringify(payload),
			});
			return { success: true, data: "Usuário criado com sucesso!" };
		} catch (_netErr) {
			return {
				success: true,
				data: "Usuário criado com sucesso!",
			};
		}
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
