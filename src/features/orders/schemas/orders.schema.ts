import { z } from "zod";

export const orderStatusSchema = z.enum([
	"pending",
	"preparing",
	"ready",
	"completed",
	"cancelled",
]);

export const deliveryTypeSchema = z.enum(["delivery", "takeaway"]);

export const paymentMethodSchema = z.enum(["pix", "card", "cash"]);

export const orderItemSchema = z.object({
	id: z.string().min(1),
	productId: z.string().min(1),
	name: z.string().min(1),
	quantity: z.number().int().positive(),
	unitPrice: z.number().nonnegative(),
	imageUrl: z.string().nullable().optional(),
	observation: z.string().nullable().optional(),
});

export const orderAddressSchema = z.object({
	street: z.string().min(1),
	number: z.string().min(1),
	neighborhood: z.string().min(1),
	complement: z.string().optional(),
});

export const orderSchema = z.object({
	id: z.string().min(1),
	code: z.string().min(1),
	customerName: z.string().min(1),
	customerPhone: z.string().min(1),
	deliveryType: deliveryTypeSchema,
	address: orderAddressSchema.nullable().optional(),
	paymentMethod: paymentMethodSchema,
	changeFor: z.string().nullable().optional(),
	status: orderStatusSchema,
	items: z.array(orderItemSchema).min(1),
	subtotal: z.number().nonnegative(),
	deliveryFee: z.number().nonnegative(),
	discount: z.number().nonnegative(),
	total: z.number().nonnegative(),
	observation: z.string().nullable().optional(),
	createdAt: z.string().min(1),
});

export const updateOrderStatusSchema = z.object({
	orderId: z.string().min(1, "ID do pedido é obrigatório"),
	status: orderStatusSchema,
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type DeliveryType = z.infer<typeof deliveryTypeSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderAddress = z.infer<typeof orderAddressSchema>;
export type Order = z.infer<typeof orderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
