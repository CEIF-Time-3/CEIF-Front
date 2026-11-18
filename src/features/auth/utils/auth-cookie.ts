export const AUTH_COOKIE_NAME = "accessToken";
export const USER_ROLE_COOKIE_NAME = "userRole";

export interface DecodedJwtPayload {
	sub?: string;
	email?: string;
	role?: string;
	exp?: number;
	iat?: number;
	[key: string]: unknown;
}

export function parseJwt(token: string): DecodedJwtPayload | null {
	try {
		const parts = token.split(".");
		if (parts.length < 2) return null;

		const base64Url = parts[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

		if (typeof Buffer !== "undefined") {
			const json = Buffer.from(base64, "base64").toString("utf-8");
			return JSON.parse(json) as DecodedJwtPayload;
		}

		if (typeof atob !== "undefined") {
			const json = decodeURIComponent(
				atob(base64)
					.split("")
					.map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
					.join(""),
			);
			return JSON.parse(json) as DecodedJwtPayload;
		}

		return null;
	} catch {
		return null;
	}
}

export function isTokenExpired(token: string): boolean {
	const payload = parseJwt(token);
	if (!payload?.exp) return false;
	const now = Math.floor(Date.now() / 1000);
	return payload.exp < now;
}

export function isTokenAdmin(token: string): boolean {
	const payload = parseJwt(token);
	if (!payload) return false;

	if (payload.exp && typeof payload.exp === "number") {
		const now = Math.floor(Date.now() / 1000);
		if (payload.exp < now) {
			return false;
		}
	}

	return payload.role === "admin";
}

export function setAuthCookies(token: string, role: string) {
	if (typeof document === "undefined") return;

	const maxAge = 60 * 60 * 24 * 7; // 7 days
	// biome-ignore lint/suspicious/noDocumentCookie: client cookie persistence
	document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
	// biome-ignore lint/suspicious/noDocumentCookie: client cookie persistence
	document.cookie = `${USER_ROLE_COOKIE_NAME}=${encodeURIComponent(role)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookies() {
	if (typeof document === "undefined") return;

	// biome-ignore lint/suspicious/noDocumentCookie: client cookie persistence
	document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
	// biome-ignore lint/suspicious/noDocumentCookie: client cookie persistence
	document.cookie = `${USER_ROLE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
