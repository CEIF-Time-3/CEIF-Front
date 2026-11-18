import React from "react";
import type { CreateUserStep } from "@/features/users/components/create-user-steps";
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
import { useUserStore } from "@/features/users/stores/user.store";

export const emptyPersonalValues: CreateUserPersonalFormInput = {
	name: "",
	email: "",
	phone: "",
};

export const emptyAddressValues: CreateUserAddressFormInput = {
	zipCode: "",
	street: "",
	number: "",
	complement: "",
	neighborhood: "",
	city: "",
	state: "",
};

export const useCreateUser = (mode: "customer" | "admin" = "customer") => {
	const createUser = useUserStore((state) => state.createUser);
	const getAddressByZipCode = useUserStore(
		(state) => state.getAddressByZipCode,
	);
	const isSubmitting = useUserStore((state) => state.isSubmitting);
	const isFetchingAddress = useUserStore((state) => state.isFetchingAddress);
	const addressError = useUserStore((state) => state.addressError);
	const clearErrors = useUserStore((state) => state.clearErrors);

	const [activeStep, setActiveStep] = React.useState<CreateUserStep>(0);
	const [createdPayload, setCreatedPayload] = React.useState<
		CreateUserPayload | CreateAdminUserPayload | null
	>(null);
	const [successMessage, setSuccessMessage] = React.useState<string>("");
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
		setCreatedPayload(null);
		setSuccessMessage("");
		setPersonalData(null);
		setAddressData(null);
		setRole("");
		setRoleError("");
		setPayloadError("");
		clearErrors();
	}, [clearErrors]);

	const handleStepChange = React.useCallback(
		(nextStep: CreateUserStep) => {
			if (nextStep === 0 || personalData) {
				setActiveStep(nextStep);
			}
		},
		[personalData],
	);

	const handleRoleChange = React.useCallback((value: string) => {
		setRole(value);
		setRoleError("");
	}, []);

	const handlePersonalContinue = React.useCallback(
		(data: CreateUserPersonalFormData) => {
			if (mode === "admin") {
				const validatedRole = userRoleSchema.safeParse(role);
				if (!validatedRole.success) {
					setRoleError("Selecione um perfil para continuar.");
					return;
				}
			}

			setPersonalData(data);
			setPayloadError("");
			clearErrors();
			setActiveStep(1);
		},
		[clearErrors, mode, role],
	);

	const handleAddressComplete = React.useCallback(
		async (address: CreateUserAddressFormData) => {
			setAddressData(address);

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
						"Não foi possível validar os dados. Revise as informações.",
				);
				return;
			}

			setPayloadError("");

			let finalPayload: CreateUserPayload | CreateAdminUserPayload =
				result.data;

			if (mode === "admin") {
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
							"Não foi possível validar os dados. Revise as informações.",
					);
					return;
				}

				finalPayload = adminPayload.data;
			}

			const apiResult = await createUser(finalPayload);

			if (!apiResult.success) {
				setPayloadError(apiResult.error);
				return;
			}

			setSuccessMessage(apiResult.data);
			setCreatedPayload(finalPayload);
		},
		[personalData, mode, role, createUser],
	);

	return {
		activeStep,
		setActiveStep,
		createdPayload,
		successMessage,
		personalData,
		addressData,
		role,
		roleError,
		payloadError,
		addressError,
		formVersion,
		isSubmitting,
		isFetchingAddress,
		resetWizard,
		handleStepChange,
		handleRoleChange,
		handlePersonalContinue,
		handleAddressComplete,
		lookupAddressByZipCode: getAddressByZipCode,
	};
};
