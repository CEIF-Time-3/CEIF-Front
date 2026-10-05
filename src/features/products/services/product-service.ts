import { z } from "zod";
import {
	type Product,
	type ProductFilter,
	productSchema,
} from "@/features/products/schemas/product-schema";

let MOCK_PRODUCTS: Product[] = [
	{
		id: "prod-1",
		name: "Pastel Especial de Carne",
		description:
			"Carne moída bovina selecionada, temperada com ervas finas, azeitonas fatiadas e ovo de codorna.",
		price: 16.9,
		category: "Salgados",
		imageUrl:
			"https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		badge: "Mais Pedido",
		rating: 4.9,
		prepTime: "12-15 min",
	},
	{
		id: "prod-2",
		name: "Pastel Quatro Queijos",
		description:
			"Mistura cremosa de mussarela, catupiry original, provolone defumado e queijo parmesão ralado.",
		price: 18.5,
		category: "Salgados",
		imageUrl:
			"https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		badge: "Favorito",
		rating: 4.8,
		prepTime: "10-12 min",
	},
	{
		id: "prod-3",
		name: "Pastel de Frango com Catupiry",
		description:
			"Frango desfiado suculento com tempero da casa e o legítimo requeijão Catupiry.",
		price: 17.0,
		category: "Salgados",
		imageUrl:
			"https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		rating: 4.7,
		prepTime: "10-15 min",
	},
	{
		id: "prod-4",
		name: "Pastel de Carne Seca com Queijo Coalho",
		description:
			"Carne seca desfiada artesanalmente com pedaços dourados de queijo coalho grelhado.",
		price: 21.9,
		category: "Especiais",
		imageUrl:
			"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		badge: "Gourmet",
		rating: 4.95,
		prepTime: "15-18 min",
	},
	{
		id: "prod-5",
		name: "Pastel de Calabresa Acebolada",
		description:
			"Calabresa fatiada fina refogada com cebola roxa caramelizada e cobertura de queijo mussarela.",
		price: 15.9,
		category: "Salgados",
		imageUrl:
			"https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
		isAvailable: false,
		rating: 4.6,
		prepTime: "10-12 min",
	},
	{
		id: "prod-6",
		name: "Pastel Doce de Nutella com Morango",
		description:
			"Creme de avelã Nutella abundante acompanhado de fatias frescas de morango maduro.",
		price: 19.9,
		category: "Doces",
		imageUrl:
			"https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		badge: "Sobremesa",
		rating: 4.9,
		prepTime: "8-10 min",
	},
	{
		id: "prod-7",
		name: "Pastel Romeu e Julieta",
		description:
			"Goiabada cascão cremosa derretida com generosas fatias de queijo minas padrão.",
		price: 14.5,
		category: "Doces",
		imageUrl:
			"https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		rating: 4.75,
		prepTime: "8-10 min",
	},
	{
		id: "prod-8",
		name: "Caldo de Cana Natural (500ml)",
		description:
			"Caldo de cana extraído na hora, servido bem gelado com ou sem limão.",
		price: 8.5,
		category: "Bebidas",
		imageUrl:
			"https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		badge: "Geladinho",
		rating: 4.85,
		prepTime: "3-5 min",
	},
	{
		id: "prod-9",
		name: "Coca-Cola Original 2L",
		description: "Refrigerante Coca-Cola garrafa 2 litros gelada.",
		price: 14.0,
		category: "Bebidas",
		imageUrl:
			"https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		rating: 4.9,
		prepTime: "1-2 min",
	},
	{
		id: "prod-10",
		name: "Guaraná Antarctica 350ml",
		description: "Lata de refrigerante Guaraná Antarctica bem gelada.",
		price: 6.5,
		category: "Bebidas",
		imageUrl:
			"https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80",
		isAvailable: true,
		rating: 4.8,
		prepTime: "1-2 min",
	},
];

export const productService = {
	async getProducts(filter?: ProductFilter): Promise<Product[]> {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const validatedProducts = z.array(productSchema).parse(MOCK_PRODUCTS);

		if (!filter) return validatedProducts;

		return validatedProducts.filter((product) => {
			if (filter.search) {
				const query = filter.search.toLowerCase().trim();
				const matchesName = product.name.toLowerCase().includes(query);
				const matchesDesc = product.description.toLowerCase().includes(query);
				const matchesCat = product.category.toLowerCase().includes(query);

				if (!matchesName && !matchesDesc && !matchesCat) {
					return false;
				}
			}

			if (
				filter.category &&
				filter.category !== "Todos" &&
				filter.category !== ""
			) {
				if (product.category.toLowerCase() !== filter.category.toLowerCase()) {
					return false;
				}
			}

			return true;
		});
	},

	async getCategories(): Promise<string[]> {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const categories = Array.from(
			new Set(MOCK_PRODUCTS.map((p) => p.category)),
		);
		return ["Todos", ...categories];
	},

	async toggleAvailability(id: string): Promise<Product> {
		await new Promise((resolve) => setTimeout(resolve, 150));
		const product = MOCK_PRODUCTS.find((p) => p.id === id);
		if (!product) {
			throw new Error("Produto não encontrado.");
		}
		product.isAvailable = !product.isAvailable;
		return productSchema.parse(product);
	},

	async deleteProduct(id: string): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, 150));
		MOCK_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.id !== id);
	},

	async createProduct(
		productData: Omit<Product, "id"> & { id?: string },
	): Promise<Product> {
		await new Promise((resolve) => setTimeout(resolve, 200));
		const newProduct: Product = {
			...productData,
			id: productData.id || `prod-${Date.now()}`,
			isAvailable: productData.isAvailable ?? true,
		};
		const validated = productSchema.parse(newProduct);
		MOCK_PRODUCTS.unshift(validated);
		return validated;
	},
};
