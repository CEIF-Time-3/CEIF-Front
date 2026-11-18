import { z } from "zod";

export const authUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	role: z.enum(["admin", "customer", "cliente"]),
});

export const loginResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		accessToken: z.string(),
		user: authUserSchema,
	}),
});

export const meUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	phone: z.string(),
	role: z.enum(["admin", "customer", "cliente"]),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
	addresses: z.array(z.unknown()),
});

export const meResponseSchema = z.object({
	success: z.boolean(),
	data: meUserSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type MeUser = z.infer<typeof meUserSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
