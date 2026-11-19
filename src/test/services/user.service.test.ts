import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatPhoneNumber } from "@/features/users/components/admin-user-table";
import {
	createUser,
	formatUserInitials,
	getUsers,
	mapApiUserToAdminUser,
	updateUserRole,
	updateUserStatus,
	userService,
} from "@/services/user.service";
import * as httpModule from "@/utils/http";

describe("UserService and User mapping", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("formats initials correctly", () => {
		expect(formatUserInitials("Administrador do Sistema")).toBe("AS");
		expect(formatUserInitials("Atendente João")).toBe("AJ");
		expect(formatUserInitials("João")).toBe("JO");
		expect(formatUserInitials("")).toBe("US");
	});

	it("formats Brazilian phone numbers", () => {
		expect(formatPhoneNumber("85999990001")).toBe("(85) 99999-0001");
		expect(formatPhoneNumber("1198765432")).toBe("(11) 9876-5432");
		expect(formatPhoneNumber("(85) 99999-0001")).toBe("(85) 99999-0001");
		expect(formatPhoneNumber("12345")).toBe("12345");
	});

	it("maps ApiUser to AdminUser properly", () => {
		const apiUser = {
			id: "652d38df-b49e-4be0-8422-34d108542aec",
			name: "Administrador do Sistema",
			email: "admin@ceif.com",
			phone: "85999990001",
			role: "admin" as const,
			isActive: true,
		};

		const mapped = mapApiUserToAdminUser(apiUser, 0);

		expect(mapped.id).toBe(apiUser.id);
		expect(mapped.name).toBe("Administrador do Sistema");
		expect(mapped.email).toBe("admin@ceif.com");
		expect(mapped.phone).toBe("85999990001");
		expect(mapped.role).toBe("admin");
		expect(mapped.status).toBe("active");
		expect(mapped.isActive).toBe(true);
		expect(mapped.code).toBe("#USR-001");
		expect(mapped.initials).toBe("AS");
		expect(mapped.addresses).toEqual([]);
	});

	it("successfully calls /users and parses backend response", async () => {
		const mockResponse = {
			success: true,
			data: [
				{
					id: "652d38df-b49e-4be0-8422-34d108542aec",
					name: "Administrador do Sistema",
					email: "admin@ceif.com",
					phone: "85999990001",
					role: "admin",
					isActive: true,
				},
				{
					id: "dad30a58-d582-4d48-ad52-6810af0384ec",
					name: "Cliente João",
					email: "customer@ceif.com",
					phone: "85999990002",
					role: "customer",
					isActive: true,
				},
			],
		};

		vi.spyOn(httpModule, "http").mockResolvedValue(mockResponse);

		const result = await getUsers();

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toHaveLength(2);
			expect(result.data[0].name).toBe("Administrador do Sistema");
			expect(result.data[0].role).toBe("admin");
			expect(result.data[0].status).toBe("active");

			expect(result.data[1].name).toBe("Cliente João");
			expect(result.data[1].role).toBe("customer");
			expect(result.data[1].status).toBe("active");
		}
	});

	it("handles http error gracefully", async () => {
		vi.spyOn(httpModule, "http").mockRejectedValue(new Error("Network Error"));

		const result = await getUsers();

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toBe("Network Error");
		}
	});

	it("maps inactive user without index and normalizes unknown role to customer", () => {
		const mapped = mapApiUserToAdminUser({
			id: "abcd-1234",
			name: "Carlos",
			email: "carlos@ceif.com",
			phone: "",
			role: "unknown-role",
			isActive: false,
		});

		expect(mapped.code).toBe("#USR-ABCD");
		expect(mapped.status).toBe("inactive");
		expect(mapped.role).toBe("customer");
		expect(mapped.phone).toBe("");
	});

	it("validates and updates user status and role", async () => {
		expect(await updateUserStatus("usr-1", "inactive")).toEqual({
			success: true,
			data: { userId: "usr-1", status: "inactive" },
		});
		const invalidStatus = await updateUserStatus("", "active");
		expect(invalidStatus.success).toBe(false);

		expect(await updateUserRole("usr-1", "admin")).toEqual({
			success: true,
			data: { userId: "usr-1", role: "admin" },
		});
		const invalidRole = await updateUserRole("", "customer");
		expect(invalidRole.success).toBe(false);
	});

	it("creates user via POST /users/register and handles error", async () => {
		const payload = {
			name: "Novo Usuário",
			email: "novo@ceif.com",
			phone: "85999990001",
			password: "password123",
			addresses: [],
		};

		const httpSpy = vi.spyOn(httpModule, "http").mockResolvedValue({});
		expect(await createUser(payload)).toEqual({
			success: true,
			data: "Usuário criado com sucesso!",
		});
		expect(httpSpy).toHaveBeenCalledWith("/users/register", {
			method: "POST",
			body: JSON.stringify(payload),
		});

		vi.spyOn(httpModule, "http").mockRejectedValue(
			new Error("Email já cadastrado"),
		);
		expect(await createUser(payload)).toEqual({
			success: false,
			error: "Email já cadastrado",
		});
	});

	it("delegates correctly through userService instance methods", async () => {
		vi.spyOn(httpModule, "http").mockResolvedValue({
			success: true,
			data: [],
		});

		expect((await userService.getAll()).success).toBe(true);
		expect((await userService.updateStatus("u-1", "active")).success).toBe(
			true,
		);
		expect((await userService.updateRole("u-1", "customer")).success).toBe(
			true,
		);
		expect(
			(
				await userService.createUser({
					name: "Ana",
					email: "ana@ceif.com",
					phone: "85999990001",
					password: "password123",
					addresses: [],
				})
			).success,
		).toBe(true);
	});
});
