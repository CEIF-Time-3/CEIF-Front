"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { FieldInput } from "@/components/inputs/field-input";
import { Button } from "@/components/ui/button";
import {
	type CreateUserAddressFormData,
	type CreateUserAddressFormInput,
	createUserAddressSchema,
} from "@/features/users/schemas/create-user-address.schema";

interface CreateUserAddressStepProps {
	defaultValues: CreateUserAddressFormInput;
	onBack: () => void;
	onComplete: (data: CreateUserAddressFormData) => void;
}

export const CreateUserAddressStep = ({
	defaultValues,
	onBack,
	onComplete,
}: CreateUserAddressStepProps) => {
	const { control, handleSubmit, formState } = useForm<
		CreateUserAddressFormInput,
		unknown,
		CreateUserAddressFormData
	>({
		resolver: zodResolver(createUserAddressSchema),
		defaultValues,
		mode: "onTouched",
	});

	return (
		<form
			className="px-6 py-6 sm:px-8 sm:py-7"
			onSubmit={handleSubmit(onComplete)}
		>
			<section
				aria-labelledby="address-title"
				className="space-y-4"
				id="user-step-1"
				role="tabpanel"
			>
				<div className="mb-5">
					<h3 className="font-bold" id="address-title">
						Onde você quer receber?
					</h3>
					<p className="text-sm text-muted-foreground">
						Preencha os dados do seu endereço.
					</p>
				</div>
				<div className="grid gap-4 sm:grid-cols-3">
					<FieldInput
						autoComplete="postal-code"
						control={control}
						id="zipCode"
						label="CEP"
						maxLength={20}
						name="zipCode"
						placeholder="00000-000"
						required
					/>
					<FieldInput
						control={control}
						id="street"
						label="Rua"
						name="street"
						placeholder="Nome da rua"
						required
						containerClassName="sm:col-span-2"
					/>
					<FieldInput
						control={control}
						id="number"
						label="Número"
						maxLength={20}
						name="number"
						placeholder="Nº"
						required
					/>
					<FieldInput
						control={control}
						id="complement"
						label="Complemento"
						name="complement"
						placeholder="Apto, bloco, referência (opcional)"
						containerClassName="sm:col-span-2"
					/>
					<FieldInput
						autoComplete="address-level3"
						control={control}
						id="neighborhood"
						label="Bairro"
						name="neighborhood"
						placeholder="Seu bairro"
						required
					/>
					<FieldInput
						autoComplete="address-level2"
						control={control}
						id="city"
						label="Cidade"
						name="city"
						placeholder="Sua cidade"
						required
					/>
					<FieldInput
						autoComplete="address-level1"
						control={control}
						id="state"
						label="Estado"
						maxLength={50}
						name="state"
						placeholder="Ex.: São Paulo"
						required
					/>
				</div>
			</section>
			<div className="mt-7 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-between">
				<Button onClick={onBack} type="button" variant="outline">
					<ArrowLeft className="size-4" />
					Voltar
				</Button>
				<Button disabled={formState.isSubmitting} type="submit">
					Criar
					<Check className="size-4" />
				</Button>
			</div>
		</form>
	);
};
