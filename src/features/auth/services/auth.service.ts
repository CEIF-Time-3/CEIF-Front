import {
	type AuthUser,
	loginResponseSchema,
	type MeUser,
	meResponseSchema,
} from "@/features/auth/schemas/auth.schema";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { http } from "@/utils/http";

export type { AuthUser, MeUser };

export const authService = {
	login: async (
		credentials: LoginFormValues,
	): Promise<Result<{ user: AuthUser; accessToken: string }, string>> => {
		try {
			const raw = await http<unknown>("/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email: credentials.email.trim().toLowerCase(),
					password: credentials.password,
				}),
			});

			const parsed = loginResponseSchema.safeParse(raw);

			if (!parsed.success) {
				return {
					success: false,
					error: "Resposta inesperada do servidor. Tente novamente.",
				};
			}

			return {
				success: true,
				data: {
					user: parsed.data.data.user,
					accessToken: parsed.data.data.accessToken,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: getErrorMessage(error),
			};
		}
	},

	me: async (accessToken: string): Promise<Result<MeUser, string>> => {
		try {
			const raw = await http<unknown>("/auth/me", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			const parsed = meResponseSchema.safeParse(raw);

			if (!parsed.success) {
				return {
					success: false,
					error: "Resposta inesperada do servidor. Tente novamente.",
				};
			}

			return { success: true, data: parsed.data.data };
		} catch (error) {
			return {
				success: false,
				error: getErrorMessage(error),
			};
		}
	},

	logout: async (): Promise<Result<void, string>> => {
		return { success: true, data: undefined };
	},
};
