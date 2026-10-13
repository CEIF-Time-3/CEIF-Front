import { create } from "zustand";
import type { Product } from "@/features/products/schemas/product-schema";

export interface ProductState {
  products: Product[];
}

export interface ProductActions {
  setProducts: (products: Product[]) => void;
}

export type ProductStore = ProductState & ProductActions;

const initialState: ProductState = {
  products: [],
};

export const useProductStore = create<ProductStore>((set) => ({
  ...initialState,

  setProducts: (products) => set({ products }),
}));
