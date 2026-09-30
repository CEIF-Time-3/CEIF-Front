"use client";

import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export interface UserInfo {
	name: string;
	email: string;
	role: string;
	avatar?: string;
	initials: string;
}

export interface AdminUserInfoProps {
	user: UserInfo;
	onLogout?: () => void;
	onProfileClick?: () => void;
	onSettingsClick?: () => void;
}

export const AdminUserInfo = ({
	user,
	onLogout,
	onProfileClick,
	onSettingsClick,
}: AdminUserInfoProps) => {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

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
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback>{user.initials}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-xs leading-tight">
							<span className="truncate font-semibold">{user.name}</span>
							<span className="truncate text-muted-foreground text-[11px]">
								{user.email}
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
										<AvatarImage src={user.avatar} alt={user.name} />
										<AvatarFallback>{user.initials}</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-xs leading-tight">
										<span className="truncate font-semibold">{user.name}</span>
										<span className="truncate text-muted-foreground text-[11px]">
											{user.email}
										</span>
										<Badge
											variant="secondary"
											className="mt-1 w-fit text-[10px]"
										>
											{user.role}
										</Badge>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={onProfileClick}>
								<User className="mr-2 size-4" />
								<span>Meu Perfil</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={onSettingsClick}>
								<Settings className="mr-2 size-4" />
								<span>Configurações da Conta</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem variant="destructive" onClick={onLogout}>
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
