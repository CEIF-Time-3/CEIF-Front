import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/features/cart/schemas/cart.schema";
import type { Product } from "@/features/products/schemas/products.schema";

export const parseProductPrice = (price: string | number): number => {
  if (typeof price === "number") {
    return Number.isNaN(price) ? 0 : price;
  }
  const cleaned = price.includes(",")
    ? price.replace(/\./g, "").replace(",", ".")
    : price;
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export interface CartState {
  items: CartItem[];
}

export interface CartActions {
  addItem: (product: Product, quantity?: number, observation?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateObservation: (id: string, observation: string) => void;
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, observation = "") => {
        const currentItems = get().items;
        const unitPrice = parseProductPrice(product.price);
        const existingIndex = currentItems.findIndex(
          (item) =>
            item.productId === product.id &&
            (item.observation || "") === (observation || "")
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const existing = updatedItems[existingIndex];
          updatedItems[existingIndex] = {
            ...existing,
            quantity: existing.quantity + quantity,
          };
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            unitPrice,
            imageUrl: product.imageUrl,
            quantity,
            observation: observation || null,
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      updateObservation: (id, observation) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, observation: observation || null }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "ceif-cart-storage",
    }
  )
);
