"use client";

import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const UserMenu = () => {
	const { user, logout } = useAuth();

	if (!user) return null;

	const handleLogout = async () => {
		await logout();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="focus-visible:ring-ring/50 flex cursor-pointer items-center gap-2 rounded-full outline-none focus-visible:ring-2"
				aria-label="Menu do usuário"
			>
				<Avatar size="sm">
					<AvatarFallback className="bg-primary/15 text-primary text-[10px] font-bold">
						{user.name
							.split(" ")
							.slice(0, 2)
							.map((n) => n[0])
							.join("")
							.toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<span className="text-foreground hidden max-w-28 truncate text-xs font-semibold sm:block">
					{user.name.split(" ")[0]}
				</span>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-52">
				{/* 2. Envolva o DropdownMenuLabel com o DropdownMenuGroup */}
				<DropdownMenuGroup>
					<DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
						<span className="text-foreground text-xs font-semibold">
							{user.name}
						</span>
						<span className="text-muted-foreground truncate text-[11px] font-normal">
							{user.email}
						</span>
					</DropdownMenuLabel>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="gap-2 text-xs">
					<User className="size-3.5" />
					Minha conta
				</DropdownMenuItem>

				{user.role === "admin" && (
					<DropdownMenuItem
						className="gap-2 text-xs"
						render={<a href="/admin" />}
					>
						<LayoutDashboard className="size-3.5" />
						Painel admin
					</DropdownMenuItem>
				)}

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="text-destructive focus:text-destructive gap-2 text-xs"
					onClick={handleLogout}
				>
					<LogOut className="size-3.5" />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
