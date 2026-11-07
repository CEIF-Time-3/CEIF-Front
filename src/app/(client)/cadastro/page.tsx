import { ArrowLeft, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CreateUserWizard } from "@/features/users/components/create-user-wizard";

export const metadata: Metadata = {
	title: "Criar conta",
	description:
		"Cadastre seus dados pessoais e endereço para fazer seus pedidos.",
};

export default function CreateUserPage() {
	return (
		<section className="bg-linear-to-b from-primary/10 via-background to-background py-10 sm:py-16">
			<div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<Link
					className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					href="/"
				>
					<ArrowLeft className="size-4" />
					Voltar para o início
				</Link>
				<div className="mb-6 flex items-start gap-4">
					<span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-foreground">
						<UserRound className="size-6" />
					</span>
					<div>
						<h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
							Crie sua conta
						</h1>
						<p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
							Informe seus dados pessoais e endereço para deixar seu próximo
							pedido mais prático.
						</p>
					</div>
				</div>
				<CreateUserWizard />
			</div>
		</section>
	);
}
