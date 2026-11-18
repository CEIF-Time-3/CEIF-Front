"use client";

import { UserPlus } from "lucide-react";
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
import { CreateUserWizard } from "@/features/users/components/create-user-wizard";

export const UserCreateDialog = () => {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						type="button"
						size="sm"
						className="gap-1.5 self-start sm:self-auto"
					>
						<UserPlus className="size-4" />
						<span>Novo Usuário</span>
					</Button>
				}
			/>
			<DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle className="text-lg font-extrabold">
						Cadastrar Novo Usuário
					</DialogTitle>
					<DialogDescription className="text-xs">
						Preencha o perfil de acesso, dados pessoais e endereço para
						registrar uma nova conta.
					</DialogDescription>
				</DialogHeader>
				<CreateUserWizard mode="admin" />
			</DialogContent>
		</Dialog>
	);
};
