import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminUserTable } from "@/features/users/components/admin-user-table";
import type { AdminUser } from "@/features/users/schemas/user.schema";

const makeUser = (index: number): AdminUser => ({
	id: `usr-${index}`,
	code: `#USR-00${index}`,
	name: `Usuário ${index}`,
	email: `user${index}@ceif.com`,
	phone: index === 1 ? "85999990001" : "1198765432",
	role: index === 1 ? "admin" : "customer",
	status: index === 2 ? "inactive" : "active",
	isActive: index !== 2,
	avatarUrl: index === 1 ? "https://example.com/u1.png" : null,
	initials: `U${index}`,
	addresses:
		index === 1
			? [
					{
						id: "addr-1",
						isDefault: true,
						zipCode: "60115-000",
						street: "Rua Central",
						number: "100",
						complement: undefined,
						neighborhood: "Centro",
						city: "Fortaleza",
						state: "CE",
					},
				]
			: [],
	createdAt: "2026-03-10T10:00:00.000Z",
});

describe("AdminUserTable and DataTable", () => {
	it("renders loading skeleton state", () => {
		const { container } = render(
			<AdminUserTable
				users={[]}
				isLoading
				onViewUser={vi.fn()}
				onUpdateStatus={vi.fn()}
			/>,
		);

		expect(
			container.querySelectorAll('[data-slot="skeleton"]').length,
		).toBeGreaterThan(0);
	});

	it("renders empty state and calls onResetFilters", async () => {
		const user = userEvent.setup();
		const onResetFilters = vi.fn();

		render(
			<AdminUserTable
				users={[]}
				onResetFilters={onResetFilters}
				onViewUser={vi.fn()}
				onUpdateStatus={vi.fn()}
			/>,
		);

		expect(
			screen.getByText(/Nenhum usuário encontrado correspondente aos filtros/i),
		).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /limpar filtros/i }));
		expect(onResetFilters).toHaveBeenCalledTimes(1);
	});

	it("renders users, paginates across pages, and triggers onViewUser", async () => {
		const user = userEvent.setup();
		const onViewUser = vi.fn();
		const users = [makeUser(1), makeUser(2), makeUser(3)];

		render(
			<AdminUserTable
				users={users}
				itemsPerPage={2}
				onViewUser={onViewUser}
				onUpdateStatus={vi.fn().mockResolvedValue(undefined)}
			/>,
		);

		expect(screen.getByText("Usuário 1")).toBeInTheDocument();
		expect(screen.getByText("Usuário 2")).toBeInTheDocument();
		expect(screen.queryByText("Usuário 3")).not.toBeInTheDocument();
		expect(screen.getByText("Rua Central, 100")).toBeInTheDocument();
		expect(screen.getByText("Sem endereço")).toBeInTheDocument();

		const viewButtons = screen.getAllByTitle("Ver detalhes do usuário");
		await user.click(viewButtons[0]);
		expect(onViewUser).toHaveBeenCalledWith("usr-1");

		// Navigate to page 2 via Próximo
		await user.click(screen.getByRole("button", { name: /próximo/i }));
		expect(screen.getByText("Usuário 3")).toBeInTheDocument();
		expect(screen.queryByText("Usuário 1")).not.toBeInTheDocument();

		// Navigate back via Anterior
		await user.click(screen.getByRole("button", { name: /anterior/i }));
		expect(screen.getByText("Usuário 1")).toBeInTheDocument();

		// Navigate via page number button
		await user.click(screen.getByRole("button", { name: "2" }));
		expect(screen.getByText("Usuário 3")).toBeInTheDocument();
	});
});
