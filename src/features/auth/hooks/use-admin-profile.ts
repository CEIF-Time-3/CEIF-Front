import React from "react";
import type { MeUser } from "@/features/auth/schemas/auth.schema";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export const useAdminProfile = () => {
	const accessToken = useAuthStore((state) => state.accessToken);

	const [profile, setProfile] = React.useState<MeUser | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (!accessToken) return;

		let cancelled = false;

		const fetchProfile = async () => {
			setIsLoading(true);
			setError(null);

			const result = await authService.me(accessToken);

			if (cancelled) return;

			if (result.success) {
				setProfile(result.data);
			} else {
				setError(result.error);
			}

			setIsLoading(false);
		};

		fetchProfile();

		return () => {
			cancelled = true;
		};
	}, [accessToken]);

	return { profile, isLoading, error };
};
