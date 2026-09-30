"use client";

import type { LucideIcon } from "lucide-react";
import { FileText, Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminUserInfo, type UserInfo } from "@/components/admin-user-info";
import { PastelIcon } from "@/components/icons/logo-icon";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

export type { UserInfo };
export { AdminUserInfo };

export interface NavItem {
	title: string;
	url: string;
	icon: LucideIcon;
}

export interface AdminSidebarProps {
	items?: NavItem[];
	user?: UserInfo;
}

const defaultUser: UserInfo = {
	name: "Eduardo Silva",
	email: "eduardo@ceif.com.br",
	role: "Administrador",
	avatar:
		"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
	initials: "ES",
};

const defaultNavigationItems: NavItem[] = [
	{
		title: "Dashboard",
		url: "/admin",
		icon: Home,
	},
	{
		title: "Pedidos",
		url: "/admin/pedidos",
		icon: FileText,
	},
	{
		title: "Produtos",
		url: "/admin/produtos",
		icon: Users,
	},
];

export const AdminSidebar = ({
	items = defaultNavigationItems,
	user = defaultUser,
}: AdminSidebarProps) => {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" render={<Link href="/admin" />}>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<PastelIcon className="size-5" />
							</div>
							<div className="flex flex-col gap-0.5 leading-none">
								<span className="font-semibold text-sm">CEIF Admin</span>
								<span className="text-xs text-muted-foreground">
									Painel de Gestão
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navegação</SidebarGroupLabel>
					<SidebarMenu>
						{items.map((item) => {
							const isActive = pathname === item.url;
							const Icon = item.icon;

							return (
								<SidebarMenuItem key={item.url}>
									<SidebarMenuButton
										isActive={isActive}
										tooltip={item.title}
										render={<Link href={item.url} />}
									>
										<Icon />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<AdminUserInfo user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
};
