"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { FieldInput } from "@/components/inputs/field-input";
import { Button } from "@/components/ui/button";
import {
	type AddressLookupData,
	type CreateUserAddressFormData,
	type CreateUserAddressFormInput,
	createUserAddressSchema,
} from "@/features/users/schemas/create-user-address.schema";
import type { Result } from "@/types/result";

interface CreateUserAddressStepProps {
	defaultValues: CreateUserAddressFormInput;
	isFetchingAddress?: boolean;
	isSubmitting?: boolean;
	onBack: () => void;
	onComplete: (data: CreateUserAddressFormData) => void | Promise<void>;
	onLookupZipCode?: (
		zipCode: string,
	) => Promise<Result<AddressLookupData, string>>;
}

export const CreateUserAddressStep = ({
	defaultValues,
	isFetchingAddress = false,
	isSubmitting = false,
	onBack,
	onComplete,
	onLookupZipCode,
}: CreateUserAddressStepProps) => {
	const { control, handleSubmit, setValue, formState } = useForm<
		CreateUserAddressFormInput,
		unknown,
		CreateUserAddressFormData
	>({
		resolver: zodResolver(createUserAddressSchema),
		defaultValues,
		mode: "onTouched",
	});

	const lastLookedUpZipRef = React.useRef<string>("");

	const handleZipCodeBlur = React.useCallback(
		async (event: React.FocusEvent<HTMLInputElement>) => {
			if (!onLookupZipCode) return;

			const digits = event.target.value.replace(/\D/g, "");
			if (digits.length !== 8 || digits === lastLookedUpZipRef.current) {
				return;
			}

			lastLookedUpZipRef.current = digits;
			const result = await onLookupZipCode(digits);

			if (!result.success) {
				return;
			}

			const { street, neighborhood, city, state, complement } = result.data;
			if (street) {
				setValue("street", street, { shouldValidate: true });
			}
			if (neighborhood) {
				setValue("neighborhood", neighborhood, { shouldValidate: true });
			}
			if (city) {
				setValue("city", city, { shouldValidate: true });
			}
			if (state) {
				setValue("state", state, { shouldValidate: true });
			}
			if (complement) {
				setValue("complement", complement, { shouldValidate: true });
			}
		},
		[onLookupZipCode, setValue],
	);

	const isBusy = isSubmitting || formState.isSubmitting;

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
						labelRight={
							isFetchingAddress ? (
								<span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
									<Loader2 className="size-3 animate-spin" />
									Buscando...
								</span>
							) : undefined
						}
						maxLength={20}
						name="zipCode"
						onBlur={handleZipCodeBlur}
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
				<Button
					disabled={isBusy}
					onClick={onBack}
					type="button"
					variant="outline"
				>
					<ArrowLeft className="size-4" />
					Voltar
				</Button>
				<Button disabled={isBusy} type="submit">
					{isBusy ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Criando...
						</>
					) : (
						<>
							Criar
							<Check className="size-4" />
						</>
					)}
				</Button>
			</div>
		</form>
	);
};
