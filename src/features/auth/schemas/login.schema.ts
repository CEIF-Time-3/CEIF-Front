import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Informe um e-mail válido").min(1, "O e-mail é obrigatório"),
	password: z
		.string()
		.min(1, "A senha é obrigatória")
		.min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
