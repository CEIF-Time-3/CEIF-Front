import { Categorie } from "../schemas/categorie-schema";

export class CategorieService {
  async categoriesProducts(): Promise<Categorie[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch categories and products");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching categories and products:", error);
    throw error;
  }
}
}

export const categorieService = new CategorieService();