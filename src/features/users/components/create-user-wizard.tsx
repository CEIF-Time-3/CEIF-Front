"use client";

import { CreateUserAddressStep } from "@/features/users/components/create-user-address-step";
import { CreateUserPayloadView } from "@/features/users/components/create-user-payload";
import { CreateUserPersonalStep } from "@/features/users/components/create-user-personal-step";
import { CreateUserRoleField } from "@/features/users/components/create-user-role-field";
import { CreateUserSteps } from "@/features/users/components/create-user-steps";
import {
	emptyAddressValues,
	emptyPersonalValues,
	useCreateUser,
} from "@/features/users/hooks/use-create-user";

interface CreateUserWizardProps {
	mode?: "customer" | "admin";
}

export const CreateUserWizard = ({
	mode = "customer",
}: CreateUserWizardProps) => {
	const {
		activeStep,
		setActiveStep,
		createdPayload,
		successMessage,
		personalData,
		addressData,
		role,
		roleError,
		payloadError,
		formVersion,
		isSubmitting,
		isFetchingAddress,
		resetWizard,
		handleStepChange,
		handleRoleChange,
		handlePersonalContinue,
		handleAddressComplete,
		lookupAddressByZipCode,
	} = useCreateUser(mode);

	return (
		<div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
			{createdPayload ? (
				<CreateUserPayloadView
					message={successMessage}
					onRestart={resetWizard}
					payload={createdPayload}
				/>
			) : (
				<>
					<div className="px-6 pt-6 sm:px-8 sm:pt-8">
						<div className="space-y-5">
							{mode === "admin" && (
								<CreateUserRoleField
									error={roleError}
									onValueChange={handleRoleChange}
									value={role}
								/>
							)}
							<CreateUserSteps
								activeStep={activeStep}
								canOpenAddress={activeStep === 1 || Boolean(personalData)}
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
							defaultValues={personalData ?? emptyPersonalValues}
							key={`personal-${formVersion}`}
							onContinue={handlePersonalContinue}
						/>
					</div>
					<div hidden={activeStep !== 1}>
						<CreateUserAddressStep
							defaultValues={addressData ?? emptyAddressValues}
							isFetchingAddress={isFetchingAddress}
							isSubmitting={isSubmitting}
							key={`address-${formVersion}`}
							onBack={() => setActiveStep(0)}
							onComplete={handleAddressComplete}
							onLookupZipCode={lookupAddressByZipCode}
						/>
					</div>
				</>
			)}
		</div>
	);
};
