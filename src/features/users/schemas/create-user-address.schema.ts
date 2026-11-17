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

export const addressLookupDataSchema = z
	.object({
		zipCode: z.string().trim().nullish(),
		cep: z.string().trim().nullish(),
		street: z.string().trim().nullish(),
		logradouro: z.string().trim().nullish(),
		number: z.string().trim().nullish(),
		complement: z.string().trim().nullish(),
		complemento: z.string().trim().nullish(),
		neighborhood: z.string().trim().nullish(),
		bairro: z.string().trim().nullish(),
		city: z.string().trim().nullish(),
		localidade: z.string().trim().nullish(),
		state: z.string().trim().nullish(),
		uf: z.string().trim().nullish(),
		estado: z.string().trim().nullish(),
	})
	.transform((item) => ({
		zipCode: item.zipCode ?? item.cep ?? "",
		street: item.street ?? item.logradouro ?? "",
		number: item.number ?? "",
		complement: item.complement || item.complemento || undefined,
		neighborhood: item.neighborhood ?? item.bairro ?? "",
		city: item.city ?? item.localidade ?? "",
		state: item.state ?? item.estado ?? item.uf ?? "",
	}));

export const addressLookupResponseSchema = z
	.union([
		z.object({
			data: addressLookupDataSchema,
			success: z.boolean().optional(),
		}),
		addressLookupDataSchema,
	])
	.transform((val) => ("data" in val ? val.data : val));

export type CreateUserAddressFormInput = z.input<
	typeof createUserAddressSchema
>;
export type CreateUserAddressFormData = z.output<
	typeof createUserAddressSchema
>;
export type AddressLookupData = z.output<typeof addressLookupDataSchema>;
