import { UserRoundPlus } from "lucide-react";
import type { Metadata } from "next";
import { CreateUserWizard } from "@/features/users/components/create-user-wizard";

export const metadata: Metadata = {
	title: "Cadastrar usuário",
	description: "Cadastre uma conta de cliente ou administrador.",
};

export default function AdminCreateUserPage() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
			<div className="flex items-start gap-4">
				<span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-foreground">
					<UserRoundPlus className="size-5" />
				</span>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Cadastrar usuário
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Crie uma conta e defina se ela terá perfil de cliente ou
						administrador.
					</p>
				</div>
			</div>
			<CreateUserWizard mode="admin" />
		</div>
	);
}
