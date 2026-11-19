import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { clearAuthCookies } from "@/features/auth/utils/auth-cookie";
import * as httpModule from "@/utils/http";

describe("authService and useAuthStore", () => {
	beforeEach(() => {
		localStorage.clear();
		clearAuthCookies();
		useAuthStore.setState({
			user: null,
			accessToken: null,
			isAuthenticated: false,
		});
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		clearAuthCookies();
	});

	it("logs in successfully and normalizes email", async () => {
		const httpSpy = vi.spyOn(httpModule, "http").mockResolvedValue({
			success: true,
			data: {
				accessToken: "jwt-token",
				user: {
					id: "u-1",
					name: "Admin",
					email: "admin@ceif.com",
					role: "admin",
				},
			},
		});

		const result = await authService.login({
			email: "  ADMIN@CEIF.COM ",
			password: "password123",
		});

		expect(httpSpy).toHaveBeenCalledWith("/auth/login", {
			method: "POST",
			body: JSON.stringify({
				email: "admin@ceif.com",
				password: "password123",
			}),
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.accessToken).toBe("jwt-token");
			expect(result.data.user.role).toBe("admin");
		}
	});

	it("returns error on unexpected login response payload", async () => {
		vi.spyOn(httpModule, "http").mockResolvedValue({ invalid: true });

		const result = await authService.login({
			email: "admin@ceif.com",
			password: "password123",
		});

		expect(result).toEqual({
			success: false,
			error: "Resposta inesperada do servidor. Tente novamente.",
		});
	});

	it("handles http error during login", async () => {
		vi.spyOn(httpModule, "http").mockRejectedValue(
			new Error("Credenciais inválidas"),
		);

		const result = await authService.login({
			email: "admin@ceif.com",
			password: "wrong",
		});

		expect(result).toEqual({
			success: false,
			error: "Credenciais inválidas",
		});
	});

	it("fetches /auth/me successfully", async () => {
		const httpSpy = vi.spyOn(httpModule, "http").mockResolvedValue({
			success: true,
			data: {
				id: "u-1",
				name: "Admin",
				email: "admin@ceif.com",
				phone: "85999990001",
				role: "admin",
				isActive: true,
				createdAt: "2026-01-01",
				updatedAt: "2026-01-02",
				addresses: [],
			},
		});

		const result = await authService.me("my-token");

		expect(httpSpy).toHaveBeenCalledWith("/auth/me", {
			headers: { Authorization: "Bearer my-token" },
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.email).toBe("admin@ceif.com");
		}
	});

	it("handles invalid /auth/me schema and network error", async () => {
		vi.spyOn(httpModule, "http").mockResolvedValue({ success: true, data: {} });
		const invalid = await authService.me("tok");
		expect(invalid).toEqual({
			success: false,
			error: "Resposta inesperada do servidor. Tente novamente.",
		});

		vi.spyOn(httpModule, "http").mockRejectedValue(new Error("Unauthorized"));
		const failed = await authService.me("tok");
		expect(failed).toEqual({
			success: false,
			error: "Unauthorized",
		});
	});

	it("resolves logout successfully", async () => {
		const result = await authService.logout();
		expect(result).toEqual({ success: true, data: undefined });
	});

	it("sets and clears session in useAuthStore", () => {
		const user = {
			id: "u-1",
			name: "Admin",
			email: "admin@ceif.com",
			role: "admin" as const,
		};

		useAuthStore.getState().setSession(user, "token-xyz");
		expect(useAuthStore.getState()).toMatchObject({
			user,
			accessToken: "token-xyz",
			isAuthenticated: true,
		});
		expect(document.cookie).toContain("accessToken=token-xyz");

		useAuthStore.getState().clearSession();
		expect(useAuthStore.getState()).toMatchObject({
			user: null,
			accessToken: null,
			isAuthenticated: false,
		});
	});
});
