import {
  type Order,
  type OrderStatus,
  updateOrderStatusSchema,
} from "@/features/orders/schemas/orders.schema";
import { MOCK_ORDERS } from "@/mocks/orders";
import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const getOrders = async (): Promise<Result<Order[], string>> => {
  try {
    return {
      success: true,
      data: [...MOCK_ORDERS],
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<Result<{ orderId: string; status: OrderStatus }, string>> => {
  try {
    const parsed = updateOrderStatusSchema.safeParse({ orderId, status });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
      };
    }

    return {
      success: true,
      data: parsed.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

export const ordersService = {
  getAll: getOrders,
  updateStatus: updateOrderStatus,
};
