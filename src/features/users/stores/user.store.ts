import { create } from "zustand";
import type {
	CreateAdminUserPayload,
	CreateUserPayload,
} from "@/features/users/schemas/create-user.schema";
import type { AddressLookupData } from "@/features/users/schemas/create-user-address.schema";
import type {
	AdminUser,
	UserRole,
	UserStatus,
} from "@/features/users/schemas/user.schema";
import { addressesService } from "@/features/users/service/addresses.service";
import { userService } from "@/features/users/service/user.service";
import { MOCK_USERS } from "@/mocks/user";
import type { Result } from "@/types/result";

const getInitials = (name: string): string => {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "US";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const buildAdminUserFromPayload = (
	payload: CreateUserPayload | CreateAdminUserPayload,
	existingCount: number,
): AdminUser => {
	const nextNumber = String(existingCount + 1).padStart(3, "0");
	const role: UserRole = "role" in payload ? payload.role : "cliente";

	return {
		id: `usr-${Date.now()}`,
		code: `#USR-${nextNumber}`,
		name: payload.name,
		email: payload.email,
		phone: payload.phone,
		role,
		status: "active",
		avatarUrl: null,
		initials: getInitials(payload.name),
		addresses: payload.addresses.map((address, index) => ({
			...address,
			id: `addr-${Date.now()}-${index + 1}`,
			label: "Principal",
			isDefault: index === 0,
		})),
		createdAt: new Date().toISOString(),
	};
};

export interface UserState {
	users: AdminUser[];
	isLoading: boolean;
	isSubmitting: boolean;
	isFetchingAddress: boolean;
	error: string | null;
	addressError: string | null;
}

export interface UserActions {
	setUsers: (users: AdminUser[]) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	updateStatusInStore: (userId: string, status: UserStatus) => void;
	updateRoleInStore: (userId: string, role: UserRole) => void;
	addUserToStore: (user: AdminUser) => void;
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
	users: MOCK_USERS,
	isLoading: false,
	isSubmitting: false,
	isFetchingAddress: false,
	error: null,
	addressError: null,
};

export const useUserStore = create<UserStore>((set) => ({
	...initialState,

	setUsers: (users) => set({ users, error: null }),
	setLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),

	updateStatusInStore: (userId, status) =>
		set((state) => ({
			users: state.users.map((user) =>
				user.id === userId ? { ...user, status } : user,
			),
		})),

	updateRoleInStore: (userId, role) =>
		set((state) => ({
			users: state.users.map((user) =>
				user.id === userId ? { ...user, role } : user,
			),
		})),

	addUserToStore: (user) =>
		set((state) => ({
			users: [user, ...state.users],
		})),

	createUser: async (payload) => {
		set({ isSubmitting: true, error: null });
		const result = await userService.createUser(payload);
		if (result.success) {
			set((state) => ({
				isSubmitting: false,
				error: null,
				users: [
					buildAdminUserFromPayload(payload, state.users.length),
					...state.users,
				],
			}));
		} else {
			set({ isSubmitting: false, error: result.error });
		}
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
