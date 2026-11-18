import React from "react";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import type { AuthUser } from "@/features/auth/services/auth.service";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import type { Result } from "@/types/result";

export const useAuth = () => {
	const user = useAuthStore((state) => state.user);
	const accessToken = useAuthStore((state) => state.accessToken);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const setSession = useAuthStore((state) => state.setSession);
	const clearSession = useAuthStore((state) => state.clearSession);

	const [isLoggingIn, setIsLoggingIn] = React.useState(false);
	const [loginError, setLoginError] = React.useState<string | null>(null);

	const login = React.useCallback(
		async (credentials: LoginFormValues): Promise<Result<AuthUser, string>> => {
			setIsLoggingIn(true);
			setLoginError(null);

			try {
				const result = await authService.login(credentials);

				if (result.success) {
					setSession(result.data.user, result.data.accessToken);
					return { success: true, data: result.data.user };
				}

				setLoginError(result.error);
				return result;
			} finally {
				setIsLoggingIn(false);
			}
		},
		[setSession],
	);

	const logout = React.useCallback(async () => {
		await authService.logout();
		clearSession();
	}, [clearSession]);

	const clearLoginError = React.useCallback(() => {
		setLoginError(null);
	}, []);

	return {
		user,
		accessToken,
		isAuthenticated,
		isLoggingIn,
		loginError,
		login,
		logout,
		clearLoginError,
	};
};
