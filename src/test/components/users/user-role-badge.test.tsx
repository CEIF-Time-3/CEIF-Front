import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	UserRoleBadge,
	UserStatusBadge,
} from "@/features/users/components/user-role-badge";

describe("UserRoleBadge and UserStatusBadge", () => {
	it.each([
		["admin", "Administrador"],
		["customer", "Cliente"],
		["cliente", "Cliente"],
		["supervisor", "supervisor"],
	])("renders role label for %s as %s", (userRole, expectedLabel) => {
		render(<UserRoleBadge role={userRole} />);
		expect(screen.getByText(expectedLabel)).toBeInTheDocument();
	});

	it("renders active and inactive status badges", () => {
		const { rerender } = render(<UserStatusBadge status="active" />);
		expect(screen.getByText("Ativo")).toBeInTheDocument();

		rerender(<UserStatusBadge status="inactive" />);
		expect(screen.getByText("Inativo")).toBeInTheDocument();
	});
});
