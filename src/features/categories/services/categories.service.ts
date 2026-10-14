import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { http } from "@/utils/http";
import type { Categorie } from "../schemas/categories.schema";
import { categorieResponseSchema } from "../schemas/categories.schema";

export class CategorieService {
	async getAll(): Promise<Result<Categorie[], string>> {
		try {
			const data = await http<unknown>("/categories");

			const parsedData = categorieResponseSchema.parse(data);

			return { success: true, data: parsedData.data };
		} catch (error) {
			return { success: false, error: getErrorMessage(error) };
		}
	}
}

export const categorieService = new CategorieService();
