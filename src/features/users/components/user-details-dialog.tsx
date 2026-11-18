"use client";

import { CalendarClock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

import { SelectInput } from "@/components/inputs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	USER_STATUS_CONFIG,
	UserRoleBadge,
	UserStatusBadge,
} from "@/features/users/components/user-role-badge";
import type {
	AdminUser,
	UserRole,
	UserStatus,
} from "@/features/users/schemas/user.schema";

interface UserDetailsDialogProps {
	user: AdminUser | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdateStatus: (userId: string, nextStatus: UserStatus) => Promise<unknown>;
	onUpdateRole: (userId: string, nextRole: UserRole) => Promise<unknown>;
}

const roleSelectOptions = [
	{ label: "Cliente", value: "cliente" },
	{ label: "Administrador", value: "admin" },
];

const statusSelectOptions = [
	{ label: "Ativo", value: "active" },
	{ label: "Inativo", value: "inactive" },
];

export const formatUserDate = (isoDate: string): string => {
	const parsed = new Date(isoDate);
	if (Number.isNaN(parsed.getTime())) {
		return isoDate;
	}
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(parsed);
};

export const UserDetailsDialog = ({
	user,
	open,
	onOpenChange,
	onUpdateStatus,
	onUpdateRole,
}: UserDetailsDialogProps) => {
	const [isUpdating, setIsUpdating] = React.useState(false);

	if (!user) {
		return null;
	}

	const statusConfig = USER_STATUS_CONFIG[user.status];

	const handleStatusChange = async (newStatus: UserStatus) => {
		if (newStatus === user.status) return;
		setIsUpdating(true);
		await onUpdateStatus(user.id, newStatus);
		setIsUpdating(false);
	};

	const handleRoleChange = async (newRole: UserRole) => {
		if (newRole === user.role) return;
		setIsUpdating(true);
		await onUpdateRole(user.id, newRole);
		setIsUpdating(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<div className="flex flex-wrap items-center justify-between gap-2 pr-6">
						<div className="flex items-center gap-2">
							<DialogTitle className="text-lg font-extrabold">
								Usuário {user.code}
							</DialogTitle>
							<UserRoleBadge role={user.role} />
							<UserStatusBadge status={user.status} />
						</div>
					</div>
					<DialogDescription className="flex items-center gap-1.5 text-xs">
						<CalendarClock className="size-3.5" />
						<span>Cadastrado em {formatUserDate(user.createdAt)}</span>
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-2">
					{/* Cabeçalho do Perfil */}
					<div className="border-border bg-muted/40 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-3.5">
							<Avatar size="lg" className="border-border size-14 border">
								{user.avatarUrl && (
									<AvatarImage src={user.avatarUrl} alt={user.name} />
								)}
								<AvatarFallback className="bg-primary/20 text-foreground text-sm font-bold">
									{user.initials}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col gap-1">
								<h3 className="text-foreground text-base font-bold">
									{user.name}
								</h3>
								<div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
									<span className="flex items-center gap-1">
										<Mail className="size-3.5" />
										{user.email}
									</span>
									<span className="flex items-center gap-1">
										<Phone className="size-3.5" />
										{user.phone}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Endereços Cadastrados */}
					<div className="flex flex-col gap-2.5">
						<div className="flex items-center justify-between">
							<h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
								Endereços Cadastrados ({user.addresses.length})
							</h4>
						</div>

						<div className="flex flex-col gap-2.5">
							{user.addresses.map((address) => (
								<div
									key={address.id}
									className="border-border bg-muted/30 flex flex-col gap-1.5 rounded-xl border p-3.5"
								>
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5 text-xs font-bold">
											<MapPin className="text-primary size-3.5" />
											<span>{address.label ?? "Endereço"}</span>
										</div>
										{address.isDefault && (
											<Badge
												variant="secondary"
												className="text-[10px] font-semibold"
											>
												Principal
											</Badge>
										)}
									</div>
									<p className="text-foreground text-xs font-semibold">
										{address.street}, {address.number}
										{address.complement ? ` — ${address.complement}` : ""}
									</p>
									<p className="text-muted-foreground text-xs">
										{address.neighborhood} • {address.city}/{address.state} •
										CEP {address.zipCode}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* Configurações de Conta */}
					<div className="border-border bg-card grid grid-cols-1 gap-4 rounded-xl border p-3.5 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<span className="text-foreground text-xs font-bold">
								Perfil de Acesso
							</span>
							<span className="text-muted-foreground text-xs">
								Define as permissões de acesso no sistema.
							</span>
							<SelectInput
								size="sm"
								value={user.role}
								disabled={isUpdating}
								onValueChange={(val) => void handleRoleChange(val as UserRole)}
								options={roleSelectOptions}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<span className="text-foreground text-xs font-bold">
								Status da Conta
							</span>
							<span className="text-muted-foreground text-xs">
								Controla se o usuário está ativo na plataforma.
							</span>
							<SelectInput
								size="sm"
								value={user.status}
								disabled={isUpdating}
								onValueChange={(val) =>
									void handleStatusChange(val as UserStatus)
								}
								options={statusSelectOptions}
							/>
						</div>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Fechar
					</Button>
					<Button
						type="button"
						variant={user.status === "active" ? "destructive" : "default"}
						disabled={isUpdating}
						onClick={() => void handleStatusChange(statusConfig.nextStatus)}
					>
						{statusConfig.nextLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
