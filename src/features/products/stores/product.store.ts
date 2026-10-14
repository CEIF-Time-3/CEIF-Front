import { create } from "zustand";
import type {
  Product,
  ProductCreateInput,
} from "@/features/products/schemas/products.schema";
import { productService } from "@/features/products/services/product.service";
import type { Result } from "@/types/result";

export interface ProductState {
  products: Product[];
  isLoading: boolean;
}

export interface ProductActions {
  setProducts: (products: Product[]) => void;
  getAll: () => Promise<void>;
  create: (input: ProductCreateInput) => Promise<Result<string, string>>;
}

export type ProductStore = ProductState & ProductActions;

const initialState: ProductState = {
  products: [],
  isLoading: false,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  ...initialState,

  setProducts: (products) => set({ products }),

  getAll: async () => {
    set({ isLoading: true });

    const result = await productService.getAll();

    if (result.success) {
      set({ products: result.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  create: async (input: ProductCreateInput) => {
    set({ isLoading: true });

    const result = await productService.create(input);

    if (result.success) {
      await get().getAll();
    } else {
      set({ isLoading: false });
    }

    return result;
  },
}));
