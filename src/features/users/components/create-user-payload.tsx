import { Check, MapPin, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
	CreateAdminUserPayload,
	CreateUserPayload,
} from "@/features/users/schemas/create-user.schema";

interface CreateUserPayloadProps {
	payload: CreateUserPayload | CreateAdminUserPayload;
	message?: string;
	onRestart: () => void;
}

export const CreateUserPayloadView = ({
	payload,
	message,
	onRestart,
}: CreateUserPayloadProps) => {
	const address = payload.addresses[0];
	const roleLabel =
		"role" in payload
			? payload.role === "admin"
				? "Administrador"
				: "Cliente"
			: null;

	return (
		<section
			aria-labelledby="payload-title"
			className="space-y-5 px-6 py-6 sm:px-8 sm:py-8"
		>
			<div className="flex items-start gap-3">
				<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-foreground">
					<Check className="size-5" />
				</span>
				<div>
					<h3 className="text-lg font-bold" id="payload-title">
						{message || "Usuário criado com sucesso!"}
					</h3>
					<p className="text-sm text-muted-foreground">
						Os dados pessoais e o endereço foram registrados com sucesso.
					</p>
				</div>
			</div>

			<div className="grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2">
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
						<UserRound className="size-3.5" />
						Dados pessoais
					</div>
					<div className="space-y-1 text-sm">
						<p className="font-semibold text-foreground">{payload.name}</p>
						<p className="text-muted-foreground">{payload.email}</p>
						<p className="text-muted-foreground">{payload.phone}</p>
						{roleLabel && (
							<p className="text-xs font-medium text-foreground">
								Perfil: {roleLabel}
							</p>
						)}
					</div>
				</div>

				{address && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
							<MapPin className="size-3.5" />
							Endereço cadastrado
						</div>
						<div className="space-y-1 text-sm text-muted-foreground">
							<p className="font-medium text-foreground">
								{address.street}, {address.number}
								{address.complement ? ` - ${address.complement}` : ""}
							</p>
							<p>
								{address.neighborhood} - {address.city}/{address.state}
							</p>
							<p className="text-xs">CEP: {address.zipCode}</p>
						</div>
					</div>
				)}
			</div>

			<div className="flex justify-end border-t pt-4">
				<Button onClick={onRestart} type="button">
					Novo cadastro
				</Button>
			</div>
		</section>
	);
};
