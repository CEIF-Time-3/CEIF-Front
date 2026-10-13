import { z } from "zod";

export const productSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório"),
  imageUrl: z.string().nullable(),
  description: z.string().nullable(),
  available: z.boolean().default(true),
  ingredients: z.string().nullable(),
});

export const productResponseSchema = z.object({
  data: z.array(productSchema),
  success: z.boolean(),
});

export const productCreateSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do produto é obrigatório")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  price: z.string().min(1, "O preço é obrigatório"),
  categoryId: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .nullable()
    .optional(),
  available: z.boolean().default(true),
  ingredients: z.string().nullable().optional(),
});

export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z
    .enum(["featured", "price-asc", "price-desc", "name-asc", "name-desc"])
    .optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
