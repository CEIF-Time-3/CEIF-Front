import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/features/auth/services/auth.service";
import {
	clearAuthCookies,
	setAuthCookies,
} from "@/features/auth/utils/auth-cookie";

interface AuthState {
	user: AuthUser | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	setSession: (user: AuthUser, accessToken: string) => void;
	clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			accessToken: null,
			isAuthenticated: false,
			setSession: (user, accessToken) => {
				setAuthCookies(accessToken, user.role);
				set({ user, accessToken, isAuthenticated: true });
			},
			clearSession: () => {
				clearAuthCookies();
				set({ user: null, accessToken: null, isAuthenticated: false });
			},
		}),
		{
			name: "ceif-auth",
			onRehydrateStorage: () => (state) => {
				if (state?.accessToken && state?.user?.role) {
					setAuthCookies(state.accessToken, state.user.role);
				}
			},
		},
	),
);
