import { create } from "zustand";
import type {
	Product,
	ProductCreateInput,
	ProductUpdateInput,
} from "@/features/products/schemas/products.schema";
import { productService } from "@/features/products/services/product.service";
import type { Result } from "@/types/result";

export interface ProductState {
	products: Product[];
	isLoading: boolean;
	error: string | null;
}

export interface ProductActions {
	setProducts: (products: Product[]) => void;
	getAll: () => Promise<Result<Product[], string>>;
	create: (input: ProductCreateInput) => Promise<Result<string, string>>;
	update: (
		id: string,
		input: ProductUpdateInput,
	) => Promise<Result<string, string>>;
	setAvailability: (
		id: string,
		available: boolean,
	) => Promise<Result<string, string>>;
	deleteProduct: (id: string) => Promise<Result<string, string>>;
}

export type ProductStore = ProductState & ProductActions;

const initialState: ProductState = {
	products: [],
	isLoading: false,
	error: null,
};

export const useProductStore = create<ProductStore>((set, get) => ({
	...initialState,

	setProducts: (products) => set({ products, error: null }),

	getAll: async () => {
		set({ isLoading: true, error: null });
		const result = await productService.getAll();
		set(
			result.success
				? { products: result.data, isLoading: false }
				: { isLoading: false, error: result.error },
		);
		return result;
	},

	create: async (input) => {
		set({ isLoading: true });
		const result = await productService.create(input);
		set({ isLoading: false });
		return result;
	},

	update: async (id, input) => {
		set({ isLoading: true });
		const result = await productService.update(id, input);
		if (result.success) {
			set((state) => ({
				products: state.products.map((product) =>
					product.id === id ? { ...product, ...input } : product,
				),
				isLoading: false,
			}));
		} else {
			set({ isLoading: false });
		}
		return result;
	},

	setAvailability: async (id, available) => {
		const product = get().products.find((item) => item.id === id);
		if (!product) {
			return { success: false, error: "Produto não encontrado." };
		}

		return get().update(id, { ...product, available });
	},

	deleteProduct: async (id) => {
		set({ isLoading: true });
		const result = await productService.deleteProduct(id);
		if (result.success) {
			set((state) => ({
				products: state.products.filter((product) => product.id !== id),
				isLoading: false,
			}));
		} else {
			set({ isLoading: false });
		}
		return result;
	},
}));
