import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
	AUTH_COOKIE_NAME,
	parseJwt,
	USER_ROLE_COOKIE_NAME,
} from "@/features/auth/utils/auth-cookie";

export function proxy(request: NextRequest) {
	const token =
		request.cookies.get(AUTH_COOKIE_NAME)?.value ||
		request.cookies.get("token")?.value;
	const roleCookie = request.cookies.get(USER_ROLE_COOKIE_NAME)?.value;

	const loginRedirectUrl = new URL("/", request.url);

	if (!token) {
		return NextResponse.redirect(loginRedirectUrl);
	}

	const payload = parseJwt(token);

	if (payload?.exp && typeof payload.exp === "number") {
		const now = Math.floor(Date.now() / 1000);
		if (payload.exp < now) {
			const response = NextResponse.redirect(loginRedirectUrl);
			response.cookies.delete(AUTH_COOKIE_NAME);
			response.cookies.delete(USER_ROLE_COOKIE_NAME);
			return response;
		}
	}

	const role = payload?.role || roleCookie;

	if (role !== "admin") {
		return NextResponse.redirect(loginRedirectUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin", "/admin/:path*"],
};
