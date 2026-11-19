import { describe, expect, it } from "vitest";
import {
	addressLookupDataSchema,
	addressLookupResponseSchema,
	createUserAddressSchema,
} from "@/features/users/schemas/create-user-address.schema";
import { createUserPersonalSchema } from "@/features/users/schemas/create-user-personal.schema";
import { apiUserSchema } from "@/features/users/schemas/user.schema";

describe("user schemas", () => {
	it("normalizes email to lowercase in createUserPersonalSchema", () => {
		const parsed = createUserPersonalSchema.parse({
			name: "  João Silva  ",
			email: "  JOAO@CEIF.COM ",
			phone: "85999990001",
			password: "secret123",
		});

		expect(parsed.name).toBe("João Silva");
		expect(parsed.email).toBe("joao@ceif.com");
	});

	it("transforms empty complement to undefined in createUserAddressSchema", () => {
		const withoutComplement = createUserAddressSchema.parse({
			zipCode: "60000-000",
			street: "Rua Teste",
			number: "10",
			complement: "   ",
			neighborhood: "Centro",
			city: "Fortaleza",
			state: "CE",
		});
		expect(withoutComplement.complement).toBeUndefined();

		const withComplement = createUserAddressSchema.parse({
			zipCode: "60000-000",
			street: "Rua Teste",
			number: "10",
			complement: "Apto 202",
			neighborhood: "Centro",
			city: "Fortaleza",
			state: "CE",
		});
		expect(withComplement.complement).toBe("Apto 202");
	});

	it("maps Portuguese ViaCEP fields in addressLookupDataSchema", () => {
		const parsed = addressLookupDataSchema.parse({
			cep: "60115-000",
			logradouro: "Av. Beira Mar",
			complemento: "Bloco A",
			bairro: "Meireles",
			localidade: "Fortaleza",
			uf: "CE",
		});

		expect(parsed).toEqual({
			zipCode: "60115-000",
			street: "Av. Beira Mar",
			number: "",
			complement: "Bloco A",
			neighborhood: "Meireles",
			city: "Fortaleza",
			state: "CE",
		});
	});

	it("unwraps both wrapped and direct payloads in addressLookupResponseSchema", () => {
		const wrapped = addressLookupResponseSchema.parse({
			success: true,
			data: {
				zipCode: "60115-000",
				street: "Rua 1",
				neighborhood: "Centro",
				city: "Fortaleza",
				state: "CE",
			},
		});
		expect(wrapped.street).toBe("Rua 1");

		const direct = addressLookupResponseSchema.parse({
			cep: "60115-000",
			logradouro: "Rua 2",
			bairro: "Aldeota",
			localidade: "Fortaleza",
			estado: "Ceará",
		});
		expect(direct.street).toBe("Rua 2");
		expect(direct.state).toBe("Ceará");
	});

	it("transforms null or omitted phone to empty string in apiUserSchema", () => {
		const parsedNull = apiUserSchema.parse({
			id: "u-1",
			name: "Maria",
			email: "maria@ceif.com",
			phone: null,
			role: "customer",
		});
		expect(parsedNull.phone).toBe("");
		expect(parsedNull.isActive).toBe(true);
	});
});
