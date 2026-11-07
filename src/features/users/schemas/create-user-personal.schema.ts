import { z } from "zod";

export const createUserPersonalSchema = z.object({
	name: z.string().trim().min(1, "O nome é obrigatório"),
	email: z
		.string()
		.trim()
		.email("Informe um e-mail válido")
		.transform((email) => email.toLowerCase()),
	phone: z
		.string()
		.trim()
		.min(1, "O telefone é obrigatório")
		.max(20, "O telefone deve ter no máximo 20 caracteres"),
});

export type CreateUserPersonalFormInput = z.input<
	typeof createUserPersonalSchema
>;
export type CreateUserPersonalFormData = z.output<
	typeof createUserPersonalSchema
>;
