import {
	type AddressLookupData,
	addressLookupResponseSchema,
	type CreateUserAddressFormInput,
} from "@/features/users/schemas/create-user-address.schema";
import type { Result } from "@/types/result";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { http } from "@/utils/http";

export class AddressesService {
	async getAddressByZipCode(
		data: Pick<CreateUserAddressFormInput, "zipCode"> | string,
	): Promise<Result<AddressLookupData, string>> {
		try {
			const rawZipCode = typeof data === "string" ? data : data.zipCode;
			const sanitizedZipCode =
				rawZipCode.replace(/\D/g, "") || rawZipCode.trim();
			const response = await http<unknown>(
				`/addresses/${encodeURIComponent(sanitizedZipCode)}`,
				{
					method: "GET",
				},
			);
			const parsedData = addressLookupResponseSchema.parse(response);

			return { success: true, data: parsedData };
		} catch (error) {
			return { success: false, error: getErrorMessage(error) };
		}
	}
}

export const addressesService = new AddressesService();
