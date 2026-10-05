import { z } from "zod";

export const productSchema = z.object({
	id: z.string().min(1, "ID é obrigatório"),
	name: z.string().min(1, "Nome é obrigatório"),
	description: z.string(),
	price: z.number().positive("Preço deve ser positivo"),
	category: z.string().min(1, "Categoria é obrigatória"),
	imageUrl: z.string().optional(),
	isAvailable: z.boolean().default(true),
	badge: z.string().optional(),
	rating: z.number().min(0).max(5).optional(),
	prepTime: z.string().optional(),
});

export const productFilterSchema = z.object({
	search: z.string().optional(),
	category: z.string().optional(),
	sortBy: z
		.enum(["featured", "price-asc", "price-desc", "name-asc", "name-desc"])
		.optional(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
