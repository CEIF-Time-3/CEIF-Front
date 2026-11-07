"use client";

import React from "react";
import { CreateUserAddressStep } from "@/features/users/components/create-user-address-step";
import { CreateUserPayloadView } from "@/features/users/components/create-user-payload";
import { CreateUserPersonalStep } from "@/features/users/components/create-user-personal-step";
import { CreateUserRoleField } from "@/features/users/components/create-user-role-field";
import {
	type CreateUserStep,
	CreateUserSteps,
} from "@/features/users/components/create-user-steps";
import {
	type CreateAdminUserPayload,
	type CreateUserPayload,
	createAdminUserSchema,
	createUserSchema,
	userRoleSchema,
} from "@/features/users/schemas/create-user.schema";
import type {
	CreateUserAddressFormData,
	CreateUserAddressFormInput,
} from "@/features/users/schemas/create-user-address.schema";
import type {
	CreateUserPersonalFormData,
	CreateUserPersonalFormInput,
} from "@/features/users/schemas/create-user-personal.schema";

const emptyPersonalValues: CreateUserPersonalFormInput = {
	name: "",
	email: "",
	phone: "",
};

const emptyAddressValues: CreateUserAddressFormInput = {
	zipCode: "",
	street: "",
	number: "",
	complement: "",
	neighborhood: "",
	city: "",
	state: "",
};

interface CreateUserWizardProps {
	mode?: "customer" | "admin";
}

export const CreateUserWizard = ({
	mode = "customer",
}: CreateUserWizardProps) => {
	const [activeStep, setActiveStep] = React.useState<CreateUserStep>(0);
	const [payload, setPayload] = React.useState<
		CreateUserPayload | CreateAdminUserPayload | null
	>(null);
	const [personalData, setPersonalData] =
		React.useState<CreateUserPersonalFormData | null>(null);
	const [addressData, setAddressData] =
		React.useState<CreateUserAddressFormData | null>(null);
	const [role, setRole] = React.useState("");
	const [roleError, setRoleError] = React.useState("");
	const [payloadError, setPayloadError] = React.useState("");
	const [formVersion, setFormVersion] = React.useState(0);

	const resetWizard = React.useCallback(() => {
		setFormVersion((version) => version + 1);
		setActiveStep(0);
		setPayload(null);
		setPersonalData(null);
		setAddressData(null);
		setRole("");
		setRoleError("");
		setPayloadError("");
	}, []);

	const handleStepChange = (nextStep: CreateUserStep) => {
		if (nextStep === 0 || personalData) {
			setActiveStep(nextStep);
		}
	};

	const handlePersonalContinue = (data: CreateUserPersonalFormData) => {
		setPersonalData(data);
		setPayloadError("");
		setActiveStep(1);
	};

	const handleAddressComplete = (address: CreateUserAddressFormData) => {
		if (!personalData) {
			setActiveStep(0);
			return;
		}

		const result = createUserSchema.safeParse({
			...personalData,
			addresses: [address],
		});

		if (!result.success) {
			setPayloadError(
				result.error.issues[0]?.message ??
					"Não foi possível montar o payload. Revise os dados informados.",
			);
			return;
		}

		setAddressData(address);
		setPayloadError("");

		if (mode === "customer") {
			setPayload(result.data);
			return;
		}

		const validatedRole = userRoleSchema.safeParse(role);
		if (!validatedRole.success) {
			setRoleError("Selecione um perfil para continuar.");
			return;
		}

		const adminPayload = createAdminUserSchema.safeParse({
			...result.data,
			role: validatedRole.data,
		});
		if (!adminPayload.success) {
			setPayloadError(
				adminPayload.error.issues[0]?.message ??
					"Não foi possível montar o payload. Revise os dados informados.",
			);
			return;
		}

		setPayload(adminPayload.data);
	};

	return (
		<div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
			{payload ? (
				<CreateUserPayloadView
					onEdit={() => {
						setPayload(null);
						setActiveStep(0);
					}}
					onRestart={resetWizard}
					payload={payload}
				/>
			) : (
				<>
					<div className="px-6 pt-6 sm:px-8 sm:pt-8">
						<div className="space-y-5">
							{mode === "admin" && (
								<CreateUserRoleField
									error={roleError}
									onValueChange={(value) => {
										setRole(value);
										setRoleError("");
									}}
									value={role}
								/>
							)}
							<CreateUserSteps
								activeStep={activeStep}
								canOpenAddress={activeStep === 1}
								onStepChange={handleStepChange}
							/>
						</div>
					</div>
					{payloadError && (
						<p
							className="mx-6 mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive sm:mx-8"
							role="alert"
						>
							{payloadError}
						</p>
					)}
					<div hidden={activeStep !== 0}>
						<CreateUserPersonalStep
							key={`personal-${formVersion}`}
							defaultValues={personalData ?? emptyPersonalValues}
							onContinue={handlePersonalContinue}
						/>
					</div>
					<div hidden={activeStep !== 1}>
						<CreateUserAddressStep
							key={`address-${formVersion}`}
							defaultValues={addressData ?? emptyAddressValues}
							onBack={() => setActiveStep(0)}
							onComplete={handleAddressComplete}
						/>
					</div>
				</>
			)}
		</div>
	);
};
