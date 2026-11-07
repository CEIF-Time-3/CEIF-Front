export type MockUserRole = "cliente" | "admin";

export const mockUser = {
	name: "Eduardo Silva",
	email: "eduardo@ceif.com.br",
	role: "admin" as const satisfies MockUserRole,
	avatar:
		"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
	initials: "ES",
};

export const getMockUserRoleLabel = (role: MockUserRole) =>
	role === "admin" ? "Administrador" : "Cliente";
