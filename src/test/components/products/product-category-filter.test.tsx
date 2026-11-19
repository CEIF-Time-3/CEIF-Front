import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AdminProductFilters } from "@/features/products/components/admin-product-filters";
import { ProductCategoryFilter } from "@/features/products/components/product-category-filter";

describe("ProductCategoryFilter", () => {
	it("renders each category filter only once even when duplicates are passed", async () => {
		const user = userEvent.setup();
		const onSelectCategory = vi.fn();

		render(
			<ProductCategoryFilter
				categories={[
					"Todos",
					"Salgados",
					"Doces",
					"Salgados",
					"  salgados ",
					"DOCES",
					"Todos",
				]}
				selectedCategory="Todos"
				onSelectCategory={onSelectCategory}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		expect(buttons.map((button) => button.textContent)).toEqual([
			"Todos",
			"Salgados",
			"Doces",
		]);

		await user.click(screen.getByRole("button", { name: "Salgados" }));
		expect(onSelectCategory).toHaveBeenCalledWith("Salgados");
	});
});

describe("AdminProductFilters", () => {
	it("deduplicates category options in the admin filter select", async () => {
		const user = userEvent.setup();

		render(
			<AdminProductFilters
				searchQuery=""
				selectedCategory="Todos"
				statusFilter="all"
				categories={[
					{ id: "1", name: "Salgados" },
					{ id: "2", name: "Salgados" },
					{ id: "3", name: "  salgados " },
					{ id: "4", name: "Doces" },
					{ id: "5", name: "Todos" },
				]}
				onSearchChange={vi.fn()}
				onCategoryChange={vi.fn()}
				onStatusFilterChange={vi.fn()}
				onResetFilters={vi.fn()}
			/>,
		);

		const triggers = screen.getAllByRole("combobox");
		await user.click(triggers[0]);

		expect(
			screen.getAllByRole("option", { name: "Todas as categorias" }),
		).toHaveLength(1);
		expect(screen.getAllByRole("option", { name: "Salgados" })).toHaveLength(1);
		expect(screen.getAllByRole("option", { name: "Doces" })).toHaveLength(1);
		expect(screen.queryByRole("option", { name: "Todos" })).toBeNull();
	});
});
