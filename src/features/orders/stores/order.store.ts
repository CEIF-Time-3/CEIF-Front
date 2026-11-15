import { create } from "zustand";
import type {
	Order,
	OrderStatus,
} from "@/features/orders/schemas/orders.schema";
import { MOCK_ORDERS } from "@/mocks/orders";

export interface OrderState {
	orders: Order[];
	isLoading: boolean;
	error: string | null;
}

export interface OrderActions {
	setOrders: (orders: Order[]) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	updateStatusInStore: (orderId: string, status: OrderStatus) => void;
}

export type OrderStore = OrderState & OrderActions;

const initialState: OrderState = {
	orders: MOCK_ORDERS,
	isLoading: false,
	error: null,
};

export const useOrderStore = create<OrderStore>((set) => ({
	...initialState,

	setOrders: (orders) => set({ orders, error: null }),
	setLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),
	updateStatusInStore: (orderId, status) =>
		set((state) => ({
			orders: state.orders.map((order) =>
				order.id === orderId ? { ...order, status } : order,
			),
		})),
}));
