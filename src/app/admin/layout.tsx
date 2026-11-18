import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
	AUTH_COOKIE_NAME,
	parseJwt,
	USER_ROLE_COOKIE_NAME,
} from "@/features/auth/utils/auth-cookie";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const token =
		cookieStore.get(AUTH_COOKIE_NAME)?.value || cookieStore.get("token")?.value;
	const roleCookie = cookieStore.get(USER_ROLE_COOKIE_NAME)?.value;

	if (!token) {
		redirect("/");
	}

	const payload = parseJwt(token);

	if (payload?.exp && typeof payload.exp === "number") {
		const now = Math.floor(Date.now() / 1000);
		if (payload.exp < now) {
			redirect("/");
		}
	}

	const role = payload?.role || roleCookie;

	if (role !== "admin") {
		redirect("/");
	}

	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset className="flex min-h-svh flex-col min-w-0 overflow-x-hidden">
				<AdminHeader />
				<main className="flex-1 p-4 md:p-6 min-w-0 w-full">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
