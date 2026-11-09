import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";

const Counter = () => {
	const [count, setCount] = React.useState(0);
	return (
		<button type="button" onClick={() => setCount((c) => c + 1)}>
			Cliques: {count}
		</button>
	);
};

describe("React Testing Library setup", () => {
	it("renders and handles user interaction", async () => {
		const user = userEvent.setup();
		render(<Counter />);

		const button = screen.getByRole("button", { name: /cliques: 0/i });
		expect(button).toBeInTheDocument();

		await user.click(button);
		expect(screen.getByRole("button")).toHaveTextContent("Cliques: 1");
	});
});
