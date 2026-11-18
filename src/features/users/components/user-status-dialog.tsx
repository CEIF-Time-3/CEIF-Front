"use client";

import { UserCheck, UserX } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type {
	AdminUser,
	UserStatus,
} from "@/features/users/schemas/user.schema";

interface UserStatusDialogProps {
	user: AdminUser;
	onConfirmStatusChange: (
		userId: string,
		nextStatus: UserStatus,
	) => Promise<unknown>;
}

export const UserStatusDialog = ({
	user,
	onConfirmStatusChange,
}: UserStatusDialogProps) => {
	const [open, setOpen] = React.useState(false);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const isActive = user.status === "active";
	const nextStatus: UserStatus = isActive ? "inactive" : "active";

	const handleConfirm = async () => {
		setIsSubmitting(true);
		await onConfirmStatusChange(user.id, nextStatus);
		setIsSubmitting(false);
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!isSubmitting) {
					setOpen(nextOpen);
				}
			}}
		>
			<DialogTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						size="icon"
						title={isActive ? "Desativar usuário" : "Reativar usuário"}
						className={
							isActive
								? "text-muted-foreground hover:text-destructive size-8"
								: "text-muted-foreground size-8 hover:text-emerald-600"
						}
					>
						{isActive ? (
							<UserX className="size-4" />
						) : (
							<UserCheck className="size-4" />
						)}
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isActive
							? `Desativar conta de ${user.name}?`
							: `Reativar conta de ${user.name}?`}
					</DialogTitle>
					<DialogDescription>
						{isActive
							? `Tem certeza que deseja desativar o usuário "${user.name}" (${user.code})? O status da conta será alterado para Inativo.`
							: `Tem certeza que deseja reativar o usuário "${user.name}" (${user.code})? O acesso à conta será restaurado como Ativo.`}
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						disabled={isSubmitting}
						onClick={() => setOpen(false)}
					>
						Cancelar
					</Button>
					<Button
						type="button"
						variant={isActive ? "destructive" : "default"}
						disabled={isSubmitting}
						onClick={() => void handleConfirm()}
					>
						{isSubmitting
							? "Salvando..."
							: isActive
								? "Confirmar desativação"
								: "Confirmar reativação"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
