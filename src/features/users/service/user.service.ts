import type {
	CreateAdminUserPayload,
	CreateUserPayload,
} from "@/features/users/schemas/create-user.schema";
import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { http } from "@/utils/http";

export class UserService {
	async createUser(
		payload: CreateUserPayload | CreateAdminUserPayload,
	): Promise<Result<string, string>> {
		try {
			await http<unknown>("/users/register", {
				method: "POST",
				body: JSON.stringify(payload),
			});
			return { success: true, data: "Usuário criado com sucesso!" };
		} catch (error) {
			return { success: false, error: getErrorMessage(error) };
		}
	}
}

export const userService = new UserService();
