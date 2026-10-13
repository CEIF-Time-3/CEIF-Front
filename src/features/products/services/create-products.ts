import type { ProductCreateInput } from "@/features/products/schemas/product-schema";

export class ProductService {
   async create(input: ProductCreateInput) {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Falha ao criar produto");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
}

export const productService = new ProductService();