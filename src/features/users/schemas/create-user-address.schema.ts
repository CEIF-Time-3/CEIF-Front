import { z } from "zod";

export const createUserAddressSchema = z.object({
	zipCode: z
		.string()
		.trim()
		.min(1, "O CEP é obrigatório")
		.max(20, "O CEP deve ter no máximo 20 caracteres"),
	street: z.string().trim().min(1, "A rua é obrigatória"),
	number: z
		.string()
		.trim()
		.min(1, "O número é obrigatório")
		.max(20, "O número deve ter no máximo 20 caracteres"),
	complement: z
		.string()
		.trim()
		.optional()
		.transform((value) => value || undefined),
	neighborhood: z.string().trim().min(1, "O bairro é obrigatório"),
	city: z.string().trim().min(1, "A cidade é obrigatória"),
	state: z
		.string()
		.trim()
		.min(1, "O estado é obrigatório")
		.max(50, "O estado deve ter no máximo 50 caracteres"),
});

export type CreateUserAddressFormInput = z.input<
	typeof createUserAddressSchema
>;
export type CreateUserAddressFormData = z.output<
	typeof createUserAddressSchema
>;
