import { z } from "zod";

import type {
	Product,
	ProductCreateInput,
} from "@/features/products/schemas/products.schema";
import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { http } from "@/utils/http";
import { productResponseSchema } from "../schemas/products.schema";

const deleteProductResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
		data: z.string(),
	}),
	z.object({
		success: z.literal(false),
		message: z.string().optional(),
		error: z.string().optional(),
	}),
]);

export class ProductService {
	async getAll(): Promise<Result<Product[], string>> {
		try {
			const data = await http<unknown>("/products");
			const parsedData = productResponseSchema.parse(data);

			return { success: true, data: parsedData.data };
		} catch (error) {
			return { success: false, error: getErrorMessage(error) };
		}
	}

	async create(input: ProductCreateInput): Promise<Result<string, string>> {
		try {
			await http<unknown>("/products", {
				method: "POST",
				body: JSON.stringify(input),
			});

			return { success: true, data: "Produto criado com sucesso!" };
		} catch (error) {
			return { success: false, error: getErrorMessage(error) };
		}
	}

	async deleteProduct(id: string): Promise<Result<string, string>> {
		try {
			const response = await http<unknown>(
				`/products/${encodeURIComponent(id)}`,
				{ method: "DELETE" },
			);
			const parsedResponse = deleteProductResponseSchema.parse(response);

			if (!parsedResponse.success) {
				return {
					success: false,
					error:
						parsedResponse.message ??
						parsedResponse.error ??
						"Falha ao excluir produto.",
				};
			}

			return { success: true, data: parsedResponse.data };
		} catch (error) {
			return { success: false, error: getErrorMessage(error) };
		}
	}
}

export const productService = new ProductService();
