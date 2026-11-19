import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminUser } from "@/features/users/schemas/user.schema";
import { addressesService } from "@/features/users/service/addresses.service";
import { userService } from "@/features/users/service/user.service";
import { useUserStore } from "@/features/users/stores/user.store";

const existingUser: AdminUser = {
	id: "usr-1",
	code: "#USR-001",
	name: "Maria Silva",
	email: "maria@ceif.com",
	phone: "85999990001",
	role: "customer",
	status: "active",
	isActive: true,
	avatarUrl: null,
	initials: "MS",
	addresses: [],
	createdAt: "2026-01-10T10:00:00.000Z",
};

describe("useUserStore", () => {
	beforeEach(() => {
		useUserStore.setState({
			users: [],
			isLoading: false,
			isSubmitting: false,
			isFetchingAddress: false,
			error: null,
			addressError: null,
		});
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("loads users via getAll and handles errors", async () => {
		vi.spyOn(userService, "getAll").mockResolvedValueOnce({
			success: true,
			data: [existingUser],
		});

		await useUserStore.getState().getAll();
		expect(useUserStore.getState().users).toEqual([existingUser]);
		expect(useUserStore.getState().isLoading).toBe(false);

		vi.spyOn(userService, "getAll").mockResolvedValueOnce({
			success: false,
			error: "Erro ao buscar usuários",
		});

		await useUserStore.getState().getAll();
		expect(useUserStore.getState().error).toBe("Erro ao buscar usuários");
	});

	it("updates status, role, adds user, and clears errors", () => {
		useUserStore.getState().setLoading(true);
		expect(useUserStore.getState().isLoading).toBe(true);

		useUserStore.getState().setError("Erro X");
		expect(useUserStore.getState().error).toBe("Erro X");

		useUserStore.getState().setUsers([existingUser]);
		expect(useUserStore.getState().error).toBeNull();

		useUserStore.getState().updateStatusInStore("usr-1", "inactive");
		expect(useUserStore.getState().users[0].status).toBe("inactive");
		expect(useUserStore.getState().users[0].isActive).toBe(false);

		useUserStore.getState().updateRoleInStore("usr-1", "admin");
		expect(useUserStore.getState().users[0].role).toBe("admin");

		useUserStore.getState().addUserToStore({
			...existingUser,
			id: "usr-2",
			name: "João",
		});
		expect(useUserStore.getState().users).toHaveLength(2);

		useUserStore.setState({ error: "e1", addressError: "e2" });
		useUserStore.getState().clearErrors();
		expect(useUserStore.getState().error).toBeNull();
		expect(useUserStore.getState().addressError).toBeNull();
	});

	it("creates user and prepends to store on success, or sets error on failure", async () => {
		vi.spyOn(userService, "createUser").mockResolvedValueOnce({
			success: true,
			data: "Usuário criado com sucesso!",
		});

		const created = await useUserStore.getState().createUser({
			name: "Pedro Costa",
			email: "pedro@ceif.com",
			phone: "85999990002",
			password: "password123",
			role: "admin",
			addresses: [
				{
					zipCode: "60115-000",
					street: "Av. Beira Mar",
					number: "500",
					complement: undefined,
					neighborhood: "Meireles",
					city: "Fortaleza",
					state: "CE",
				},
			],
		});

		expect(created.success).toBe(true);
		expect(useUserStore.getState().users).toHaveLength(1);
		expect(useUserStore.getState().users[0].role).toBe("admin");
		expect(useUserStore.getState().users[0].addresses[0].isDefault).toBe(true);

		vi.spyOn(userService, "createUser").mockResolvedValueOnce({
			success: false,
			error: "Falha no cadastro",
		});

		const failed = await useUserStore.getState().createUser({
			name: "Erro",
			email: "erro@ceif.com",
			phone: "85999990003",
			password: "password123",
			addresses: [],
		});
		expect(failed.success).toBe(false);
		expect(useUserStore.getState().error).toBe("Falha no cadastro");
	});

	it("fetches address by zip code and manages addressError", async () => {
		vi.spyOn(addressesService, "getAddressByZipCode").mockResolvedValueOnce({
			success: true,
			data: {
				zipCode: "60115-000",
				street: "Av. Beira Mar",
				number: "",
				complement: undefined,
				neighborhood: "Meireles",
				city: "Fortaleza",
				state: "CE",
			},
		});

		const ok = await useUserStore.getState().getAddressByZipCode("60115-000");
		expect(ok.success).toBe(true);
		expect(useUserStore.getState().addressError).toBeNull();

		vi.spyOn(addressesService, "getAddressByZipCode").mockResolvedValueOnce({
			success: false,
			error: "CEP inválido",
		});

		const bad = await useUserStore.getState().getAddressByZipCode("00000");
		expect(bad.success).toBe(false);
		expect(useUserStore.getState().addressError).toBe("CEP inválido");
	});
});
