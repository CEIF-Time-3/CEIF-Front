"use client";

import { SelectInput } from "@/components/inputs";

interface CreateUserRoleFieldProps {
	error?: string;
	onValueChange: (value: string) => void;
	value: string;
}

const roleOptions = [
	{ value: "customer", label: "Cliente" },
	{ value: "admin", label: "Administrador" },
];

export const CreateUserRoleField = ({
	error,
	onValueChange,
	value,
}: CreateUserRoleFieldProps) => (
	<div className="rounded-xl border bg-background p-4">
		<div className="mb-3">
			<h3 className="text-sm font-semibold">Perfil de acesso</h3>
			<p className="text-xs text-muted-foreground">
				Selecione o perfil que será atribuído à conta.
			</p>
		</div>
		<SelectInput
			error={error}
			id="role"
			label="Perfil"
			onValueChange={onValueChange}
			options={roleOptions}
			placeholder="Selecione um perfil"
			required
			value={value}
		/>
	</div>
);
