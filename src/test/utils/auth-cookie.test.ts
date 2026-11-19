import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	AUTH_COOKIE_NAME,
	clearAuthCookies,
	isTokenAdmin,
	isTokenExpired,
	parseJwt,
	setAuthCookies,
	USER_ROLE_COOKIE_NAME,
} from "@/features/auth/utils/auth-cookie";

const createFakeJwt = (payload: Record<string, unknown>) => {
	const header = Buffer.from(
		JSON.stringify({ alg: "HS256", typ: "JWT" }),
	).toString("base64url");
	const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
	return `${header}.${body}.signature`;
};

describe("auth-cookie utils", () => {
	beforeEach(() => {
		clearAuthCookies();
	});

	afterEach(() => {
		clearAuthCookies();
	});

	it("parses valid JWT payload", () => {
		const token = createFakeJwt({
			sub: "user-1",
			email: "admin@ceif.com",
			role: "admin",
		});

		expect(parseJwt(token)).toEqual({
			sub: "user-1",
			email: "admin@ceif.com",
			role: "admin",
		});
	});

	it("returns null for malformed JWT", () => {
		expect(parseJwt("invalid-token")).toBeNull();
		expect(parseJwt("a.not-valid-json.c")).toBeNull();
	});

	it("checks token expiration correctly", () => {
		const futureExp = Math.floor(Date.now() / 1000) + 3600;
		const pastExp = Math.floor(Date.now() / 1000) - 3600;

		expect(isTokenExpired(createFakeJwt({ exp: futureExp }))).toBe(false);
		expect(isTokenExpired(createFakeJwt({ exp: pastExp }))).toBe(true);
		expect(isTokenExpired(createFakeJwt({ sub: "no-exp" }))).toBe(false);
		expect(isTokenExpired("invalid")).toBe(false);
	});

	it("checks admin role and expiration in isTokenAdmin", () => {
		const futureExp = Math.floor(Date.now() / 1000) + 3600;
		const pastExp = Math.floor(Date.now() / 1000) - 3600;

		expect(isTokenAdmin(createFakeJwt({ role: "admin", exp: futureExp }))).toBe(
			true,
		);
		expect(
			isTokenAdmin(createFakeJwt({ role: "customer", exp: futureExp })),
		).toBe(false);
		expect(isTokenAdmin(createFakeJwt({ role: "admin", exp: pastExp }))).toBe(
			false,
		);
		expect(isTokenAdmin("malformed")).toBe(false);
	});

	it("sets and clears auth cookies in document.cookie", () => {
		setAuthCookies("token-123", "admin");

		expect(document.cookie).toContain(`${AUTH_COOKIE_NAME}=token-123`);
		expect(document.cookie).toContain(`${USER_ROLE_COOKIE_NAME}=admin`);

		clearAuthCookies();

		expect(document.cookie).not.toContain("token-123");
	});
});
