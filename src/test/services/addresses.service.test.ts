import { afterEach, describe, expect, it, vi } from "vitest";
import { addressesService } from "@/features/users/service/addresses.service";
import * as httpModule from "@/utils/http";

describe("AddressesService", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("sanitizes zip code from object and returns parsed address", async () => {
		const httpSpy = vi.spyOn(httpModule, "http").mockResolvedValue({
			success: true,
			data: {
				cep: "60115-000",
				logradouro: "Av. Beira Mar",
				bairro: "Meireles",
				localidade: "Fortaleza",
				uf: "CE",
			},
		});

		const result = await addressesService.getAddressByZipCode({
			zipCode: "60115-000",
		});

		expect(httpSpy).toHaveBeenCalledWith("/addresses/60115000", {
			method: "GET",
		});
		expect(result).toEqual({
			success: true,
			data: {
				zipCode: "60115-000",
				street: "Av. Beira Mar",
				number: "",
				complement: undefined,
				neighborhood: "Meireles",
				city: "Fortaleza",
				state: "CE",
			},
		});
	});

	it("accepts raw string zip code and falls back to trimmed value if non-numeric", async () => {
		const httpSpy = vi.spyOn(httpModule, "http").mockResolvedValue({
			zipCode: "ABC",
			street: "Rua X",
			neighborhood: "Centro",
			city: "Fortaleza",
			state: "CE",
		});

		const result = await addressesService.getAddressByZipCode("  ABC  ");

		expect(httpSpy).toHaveBeenCalledWith("/addresses/ABC", { method: "GET" });
		expect(result.success).toBe(true);
	});

	it("returns error result when http fails", async () => {
		vi.spyOn(httpModule, "http").mockRejectedValue(
			new Error("CEP não encontrado"),
		);

		const result = await addressesService.getAddressByZipCode("00000-000");

		expect(result).toEqual({
			success: false,
			error: "CEP não encontrado",
		});
	});
});
