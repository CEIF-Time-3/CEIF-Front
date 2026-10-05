import type React from "react";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
