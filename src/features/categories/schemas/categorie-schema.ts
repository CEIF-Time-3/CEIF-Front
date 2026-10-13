import z from "zod";

export const categorieSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Categorie = z.infer<typeof categorieSchema>;
