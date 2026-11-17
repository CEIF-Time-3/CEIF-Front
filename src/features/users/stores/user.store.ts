import { create } from "zustand";
import type {
	CreateAdminUserPayload,
	CreateUserPayload,
} from "@/features/users/schemas/create-user.schema";
import type { AddressLookupData } from "@/features/users/schemas/create-user-address.schema";
import { addressesService } from "@/features/users/service/addresses.service";
import { userService } from "@/features/users/service/user.service";
import type { Result } from "@/types/result";

export interface UserState {
	isSubmitting: boolean;
	isFetchingAddress: boolean;
	error: string | null;
	addressError: string | null;
}

export interface UserActions {
	createUser: (
		payload: CreateUserPayload | CreateAdminUserPayload,
	) => Promise<Result<string, string>>;
	getAddressByZipCode: (
		zipCode: string,
	) => Promise<Result<AddressLookupData, string>>;
	clearErrors: () => void;
}

export type UserStore = UserState & UserActions;

const initialState: UserState = {
	isSubmitting: false,
	isFetchingAddress: false,
	error: null,
	addressError: null,
};

export const useUserStore = create<UserStore>((set) => ({
	...initialState,

	createUser: async (payload) => {
		set({ isSubmitting: true, error: null });
		const result = await userService.createUser(payload);
		set(
			result.success
				? { isSubmitting: false, error: null }
				: { isSubmitting: false, error: result.error },
		);
		return result;
	},

	getAddressByZipCode: async (zipCode) => {
		set({ isFetchingAddress: true, addressError: null });
		const result = await addressesService.getAddressByZipCode({ zipCode });
		set(
			result.success
				? { isFetchingAddress: false, addressError: null }
				: { isFetchingAddress: false, addressError: result.error },
		);
		return result;
	},

	clearErrors: () => set({ error: null, addressError: null }),
}));
