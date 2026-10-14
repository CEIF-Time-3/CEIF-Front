import type { Product } from "@/features/products/schemas/products.schema";

export interface Category {
  id: string;
  name: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: "123e4567-e89b-12d3-a456-426614174001", name: "Salgados" },
  { id: "123e4567-e89b-12d3-a456-426614174002", name: "Doces" },
  { id: "123e4567-e89b-12d3-a456-426614174003", name: "Bebidas" },
  { id: "123e4567-e89b-12d3-a456-426614174004", name: "Especiais" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Pastel Especial de Carne",
    description:
      "Carne moída bovina selecionada, temperada com ervas finas, azeitonas fatiadas e ovo de codorna.",
    price: "16,90",
    imageUrl:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: "Carne bovina, ervas finas, azeitonas, ovo de codorna",
  },
  {
    id: "prod-2",
    name: "Pastel Quatro Queijos",
    description:
      "Mistura cremosa de mussarela, catupiry original, provolone defumado e queijo parmesão ralado.",
    price: "18,50",
    imageUrl:
      "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: "Mussarela, catupiry, provolone, parmesão",
  },
  {
    id: "prod-3",
    name: "Pastel de Frango com Catupiry",
    description:
      "Frango desfiado suculento com tempero da casa e o legítimo requeijão Catupiry.",
    price: "17,00",
    imageUrl:
      "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: "Peito de frango, catupiry, tempero verde",
  },
  {
    id: "prod-4",
    name: "Pastel de Carne Seca com Queijo Coalho",
    description:
      "Carne seca desfiada artesanalmente com pedaços dourados de queijo coalho grelhado.",
    price: "21,90",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: "Carne seca, queijo coalho, manteiga de garrafa",
  },
  {
    id: "prod-5",
    name: "Pastel de Calabresa Acebolada",
    description:
      "Calabresa fatiada fina refogada com cebola roxa caramelizada e cobertura de queijo mussarela.",
    price: "15,90",
    imageUrl:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
    available: false,
    ingredients: "Calabresa defumada, cebola roxa, queijo mussarela",
  },
  {
    id: "prod-6",
    name: "Pastel Doce de Nutella com Morango",
    description:
      "Creme de avelã Nutella abundante acompanhado de fatias frescas de morango maduro.",
    price: "19,90",
    imageUrl:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: "Nutella, morangos frescos",
  },
  {
    id: "prod-7",
    name: "Pastel Romeu e Julieta",
    description:
      "Goiabada cascão cremosa derretida com generosas fatias de queijo minas padrão.",
    price: "14,50",
    imageUrl:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: "Goiabada cascão, queijo minas",
  },
  {
    id: "prod-8",
    name: "Caldo de Cana Natural (500ml)",
    description:
      "Caldo de cana extraído na hora, servido bem gelado com ou sem limão.",
    price: "8,50",
    imageUrl:
      "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: "Cana-de-açúcar fresca, limão opcional",
  },
  {
    id: "prod-9",
    name: "Coca-Cola Original 2L",
    description: "Refrigerante Coca-Cola garrafa 2 litros gelada.",
    price: "14,00",
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: null,
  },
  {
    id: "prod-10",
    name: "Guaraná Antarctica 350ml",
    description: "Lata de refrigerante Guaraná Antarctica bem gelada.",
    price: "6,50",
    imageUrl:
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80",
    available: true,
    ingredients: null,
  },
];
