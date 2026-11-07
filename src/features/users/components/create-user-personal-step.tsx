"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { FieldInput } from "@/components/inputs/field-input";
import { Button } from "@/components/ui/button";
import {
	type CreateUserPersonalFormData,
	type CreateUserPersonalFormInput,
	createUserPersonalSchema,
} from "@/features/users/schemas/create-user-personal.schema";

interface CreateUserPersonalStepProps {
	defaultValues: CreateUserPersonalFormInput;
	onContinue: (data: CreateUserPersonalFormData) => void;
}

export const CreateUserPersonalStep = ({
	defaultValues,
	onContinue,
}: CreateUserPersonalStepProps) => {
	const { control, handleSubmit } = useForm<
		CreateUserPersonalFormInput,
		unknown,
		CreateUserPersonalFormData
	>({
		resolver: zodResolver(createUserPersonalSchema),
		defaultValues,
		mode: "onTouched",
	});

	return (
		<form
			className="px-6 py-6 sm:px-8 sm:py-7"
			onSubmit={handleSubmit(onContinue)}
		>
			<section
				aria-labelledby="personal-title"
				className="space-y-4"
				id="user-step-0"
				role="tabpanel"
			>
				<div className="mb-5">
					<h3 className="font-bold" id="personal-title">
						Seus dados pessoais
					</h3>
					<p className="text-sm text-muted-foreground">
						Como podemos identificar você?
					</p>
				</div>
				<FieldInput
					autoComplete="name"
					control={control}
					id="name"
					label="Nome completo"
					name="name"
					placeholder="Ex.: Maria da Silva"
					required
				/>
				<div className="grid gap-4 sm:grid-cols-2">
					<FieldInput
						autoComplete="email"
						control={control}
						id="email"
						label="E-mail"
						name="email"
						placeholder="voce@email.com"
						required
						type="email"
					/>
					<FieldInput
						autoComplete="tel"
						control={control}
						id="phone"
						label="Telefone"
						maxLength={20}
						name="phone"
						placeholder="(00) 00000-0000"
						required
						type="tel"
					/>
				</div>
			</section>
			<div className="mt-7 flex justify-end border-t pt-4">
				<Button type="submit">
					Continuar
					<ArrowRight className="size-4" />
				</Button>
			</div>
		</form>
	);
};
