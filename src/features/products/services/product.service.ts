import type { Product, ProductCreateInput } from "@/schemas/product-schema";
import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { http } from "@/utils/http";
import { productResponseSchema } from "../schemas/products.schema";

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
}

export const productService = new ProductService();
