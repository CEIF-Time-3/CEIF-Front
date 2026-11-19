import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserStatusDialog } from "@/features/users/components/user-status-dialog";
import type { AdminUser } from "@/features/users/schemas/user.schema";

const activeUser: AdminUser = {
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

describe("UserStatusDialog", () => {
	it("deactivates an active user when confirmed", async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn().mockResolvedValue(undefined);

		render(
			<UserStatusDialog user={activeUser} onConfirmStatusChange={onConfirm} />,
		);

		await user.click(screen.getByTitle("Desativar usuário"));
		expect(
			await screen.findByText(/Desativar conta de Maria Silva/i),
		).toBeInTheDocument();

		await user.click(
			screen.getByRole("button", { name: /confirmar desativação/i }),
		);

		expect(onConfirm).toHaveBeenCalledWith("usr-1", "inactive");
	});

	it("reactivates an inactive user and supports cancel button", async () => {
		const user = userEvent.setup();
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const inactiveUser: AdminUser = {
			...activeUser,
			status: "inactive",
			isActive: false,
		};

		render(
			<UserStatusDialog
				user={inactiveUser}
				onConfirmStatusChange={onConfirm}
			/>,
		);

		await user.click(screen.getByTitle("Reativar usuário"));
		expect(
			await screen.findByText(/Reativar conta de Maria Silva/i),
		).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /cancelar/i }));
		expect(onConfirm).not.toHaveBeenCalled();

		await user.click(screen.getByTitle("Reativar usuário"));
		await user.click(
			await screen.findByRole("button", { name: /confirmar reativação/i }),
		);
		expect(onConfirm).toHaveBeenCalledWith("usr-1", "active");
	});
});
