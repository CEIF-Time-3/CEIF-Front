import { z } from "zod";
import { userRoleSchema } from "@/features/users/schemas/create-user.schema";
import { createUserAddressSchema } from "@/features/users/schemas/create-user-address.schema";

export const userStatusSchema = z.enum(["active", "inactive"]);

export const adminUserAddressSchema = createUserAddressSchema.extend({
	id: z.string().min(1),
	label: z.string().optional(),
	isDefault: z.boolean().optional(),
});

export const apiUserSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	email: z.string(),
	phone: z
		.string()
		.nullable()
		.optional()
		.transform((val) => val ?? ""),
	role: userRoleSchema.or(z.string()),
	isActive: z.boolean().default(true),
	code: z.string().optional(),
	avatarUrl: z.string().nullable().optional(),
	addresses: z.array(adminUserAddressSchema).optional(),
	createdAt: z.string().optional(),
});

export const usersResponseSchema = z.object({
	success: z.boolean(),
	data: z.array(apiUserSchema),
});

export const adminUserSchema = z.object({
	id: z.string().min(1),
	code: z.string().default(""),
	name: z.string().min(1),
	email: z.string(),
	phone: z.string().default(""),
	role: userRoleSchema.or(z.string()),
	status: userStatusSchema,
	isActive: z.boolean().optional(),
	avatarUrl: z.string().nullable().optional(),
	initials: z.string().default("US"),
	addresses: z.array(adminUserAddressSchema).default([]),
	createdAt: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
	userId: z.string().min(1, "ID do usuário é obrigatório"),
	status: userStatusSchema,
});

export const updateUserRoleSchema = z.object({
	userId: z.string().min(1, "ID do usuário é obrigatório"),
	role: userRoleSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type AdminUserAddress = z.infer<typeof adminUserAddressSchema>;
export type ApiUser = z.infer<typeof apiUserSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;
export type AdminUser = z.infer<typeof adminUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
