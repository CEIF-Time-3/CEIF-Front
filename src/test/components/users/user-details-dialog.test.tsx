import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
	formatUserDate,
	UserDetailsDialog,
} from "@/features/users/components/user-details-dialog";
import type { AdminUser } from "@/features/users/schemas/user.schema";

const userWithAddress: AdminUser = {
	id: "usr-1",
	code: "#USR-001",
	name: "João Pedro",
	email: "joao@ceif.com",
	phone: "85999990001",
	role: "customer",
	status: "active",
	isActive: true,
	avatarUrl: "https://example.com/avatar.png",
	initials: "JP",
	addresses: [
		{
			id: "addr-1",
			label: "Casa",
			isDefault: true,
			zipCode: "60115-000",
			street: "Av. Beira Mar",
			number: "500",
			complement: "Apto 12",
			neighborhood: "Meireles",
			city: "Fortaleza",
			state: "CE",
		},
	],
	createdAt: "2026-05-15T12:00:00.000Z",
};

describe("formatUserDate and UserDetailsDialog", () => {
	it("formats valid ISO dates, empty values, and invalid dates", () => {
		expect(formatUserDate(undefined)).toBe("-");
		expect(formatUserDate("not-a-date")).toBe("not-a-date");
		expect(formatUserDate("2026-05-15T12:00:00.000Z")).toMatch(
			/\d{2}\/\d{2}\/2026/,
		);
	});

	it("returns null when user is null", () => {
		const { container } = render(
			<UserDetailsDialog
				user={null}
				open
				onOpenChange={vi.fn()}
				onUpdateStatus={vi.fn()}
				onUpdateRole={vi.fn()}
			/>,
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders user profile, address details, and triggers status and close actions", async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		const onUpdateStatus = vi.fn().mockResolvedValue(undefined);
		const onUpdateRole = vi.fn().mockResolvedValue(undefined);

		render(
			<UserDetailsDialog
				user={userWithAddress}
				open
				onOpenChange={onOpenChange}
				onUpdateStatus={onUpdateStatus}
				onUpdateRole={onUpdateRole}
			/>,
		);

		expect(screen.getByText(/Usuário #USR-001/i)).toBeInTheDocument();
		expect(screen.getByText("João Pedro")).toBeInTheDocument();
		expect(screen.getByText("joao@ceif.com")).toBeInTheDocument();
		expect(screen.getByText("Principal")).toBeInTheDocument();
		expect(
			screen.getByText(/Av\. Beira Mar, 500 — Apto 12/),
		).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /desativar conta/i }));
		expect(onUpdateStatus).toHaveBeenCalledWith("usr-1", "inactive");

		await user.click(screen.getByRole("button", { name: /^fechar$/i }));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("renders empty addresses state for inactive user without createdAt", () => {
		render(
			<UserDetailsDialog
				user={{
					...userWithAddress,
					status: "inactive",
					isActive: false,
					avatarUrl: null,
					addresses: [],
					createdAt: undefined,
				}}
				open
				onOpenChange={vi.fn()}
				onUpdateStatus={vi.fn()}
				onUpdateRole={vi.fn()}
			/>,
		);

		expect(
			screen.getByText(/Nenhum endereço cadastrado para este usuário/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /reativar conta/i }),
		).toBeInTheDocument();
	});
});
