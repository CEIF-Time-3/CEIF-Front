"use client";

import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProfile } from "@/features/auth/hooks/use-admin-profile";
import { useAuth } from "@/features/auth/hooks/use-auth";

const getRoleLabel = (role: string) =>
	role === "admin" ? "Administrador" : "Cliente";

const getInitials = (name: string) =>
	name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0])
		.join("")
		.toUpperCase();

export const AdminUserInfo = () => {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";
	const { profile, isLoading } = useAdminProfile();
	const { logout } = useAuth();

	if (isLoading || !profile) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg" disabled>
						<Skeleton className="size-7 rounded-full shrink-0" />
						{!isCollapsed && (
							<div className="flex flex-col gap-1 flex-1">
								<Skeleton className="h-3 w-24 rounded" />
								<Skeleton className="h-2.5 w-32 rounded" />
							</div>
						)}
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	const initials = getInitials(profile.name);
	const roleLabel = getRoleLabel(profile.role);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							/>
						}
					>
						<Avatar size="sm">
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-xs leading-tight">
							<span className="truncate font-semibold">{profile.name}</span>
							<span className="truncate text-muted-foreground text-[11px]">
								{profile.email}
							</span>
						</div>
						{!isCollapsed && (
							<ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
						)}
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-64 rounded-lg"
						side={isCollapsed ? "right" : "top"}
						align="end"
						sideOffset={8}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-3 p-2 text-left">
									<Avatar size="default">
										<AvatarFallback>{initials}</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-xs leading-tight">
										<span className="truncate font-semibold">
											{profile.name}
										</span>
										<span className="truncate text-muted-foreground text-[11px]">
											{profile.email}
										</span>
										<Badge
											variant="secondary"
											className="mt-1 w-fit text-[10px]"
										>
											{roleLabel}
										</Badge>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<User className="mr-2 size-4" />
								<span>Meu Perfil</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 size-4" />
								<span>Configurações da Conta</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem variant="destructive" onClick={logout}>
								<LogOut className="mr-2 size-4" />
								<span>Sair da Plataforma</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
