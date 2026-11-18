import { z } from "zod";
import { userRoleSchema } from "@/features/users/schemas/create-user.schema";
import { createUserAddressSchema } from "@/features/users/schemas/create-user-address.schema";

export const userStatusSchema = z.enum(["active", "inactive"]);

export const adminUserAddressSchema = createUserAddressSchema.extend({
	id: z.string().min(1),
	label: z.string().optional(),
	isDefault: z.boolean().optional(),
});

export const adminUserSchema = z.object({
	id: z.string().min(1),
	code: z.string().min(1),
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().min(1),
	role: userRoleSchema,
	status: userStatusSchema,
	avatarUrl: z.string().nullable().optional(),
	initials: z.string().min(1),
	addresses: z.array(adminUserAddressSchema).min(1),
	createdAt: z.string().min(1),
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
export type AdminUser = z.infer<typeof adminUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
