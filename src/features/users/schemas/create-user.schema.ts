import { z } from "zod";
import { createUserAddressSchema } from "@/features/users/schemas/create-user-address.schema";
import { createUserPersonalSchema } from "@/features/users/schemas/create-user-personal.schema";

export const createUserSchema = createUserPersonalSchema.extend({
	addresses: z.array(createUserAddressSchema).length(1),
});

export const userRoleSchema = z.enum(["cliente", "admin"]);

export const createAdminUserSchema = createUserSchema.extend({
	role: userRoleSchema,
});

export type CreateUserFormInput = z.input<typeof createUserSchema>;
export type CreateUserFormData = z.output<typeof createUserSchema>;
export type CreateUserPayload = CreateUserFormData;
export type CreateAdminUserPayload = z.output<typeof createAdminUserSchema>;
