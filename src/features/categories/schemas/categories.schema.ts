import { z } from "zod";

export const categoriesSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const categorieResponseSchema = z.object({
  data: z.array(categoriesSchema),
  success: z.boolean().optional(),
});

export type Categorie = z.infer<typeof categoriesSchema>;
export type CategorieResponse = z.infer<typeof categorieResponseSchema>;
