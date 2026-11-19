import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CartItemCard } from "@/features/cart/components/cart-item-card";
import { CartItemList } from "@/features/cart/components/cart-item-list";
import type { CartItem } from "@/features/cart/schemas/cart.schema";

const baseItem: CartItem = {
	id: "item-1",
	productId: "prod-1",
	name: "Pastel de Carne",
	price: "15,00",
	unitPrice: 15,
	imageUrl: null,
	quantity: 2,
	observation: null,
};

describe("CartItemCard", () => {
	it("adds, cancels, and saves observation via button and Enter key", async () => {
		const user = userEvent.setup();
		const onUpdateObservation = vi.fn();
		const onUpdateQuantity = vi.fn();
		const onRemove = vi.fn();

		render(
			<CartItemCard
				item={baseItem}
				onUpdateQuantity={onUpdateQuantity}
				onRemove={onRemove}
				onUpdateObservation={onUpdateObservation}
			/>,
		);

		// Open inline editor and cancel
		await user.click(
			screen.getByRole("button", { name: /adicionar observação/i }),
		);
		const input = screen.getByPlaceholderText(/sem cebola/i);
		await user.type(input, "Sem azeitona");
		await user.click(screen.getByRole("button", { name: /cancelar/i }));
		expect(onUpdateObservation).not.toHaveBeenCalled();

		// Open again and save with Enter
		await user.click(
			screen.getByRole("button", { name: /adicionar observação/i }),
		);
		const inputAgain = screen.getByPlaceholderText(/sem cebola/i);
		await user.clear(inputAgain);
		await user.type(inputAgain, "Bem crocante{Enter}");

		expect(onUpdateObservation).toHaveBeenCalledWith("item-1", "Bem crocante");
	});

	it("edits an existing observation and decreases quantity", async () => {
		const user = userEvent.setup();
		const onUpdateObservation = vi.fn();
		const onUpdateQuantity = vi.fn();

		render(
			<CartItemCard
				item={{
					...baseItem,
					imageUrl: "https://example.com/pastel.jpg",
					observation: "Sem cebola",
				}}
				onUpdateQuantity={onUpdateQuantity}
				onRemove={vi.fn()}
				onUpdateObservation={onUpdateObservation}
			/>,
		);

		expect(screen.getByAltText("Pastel de Carne")).toBeInTheDocument();
		expect(screen.getByText(/Sem cebola/)).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /editar/i }));
		const input = screen.getByDisplayValue("Sem cebola");
		await user.clear(input);
		await user.type(input, "Com catupiry");
		await user.click(screen.getByRole("button", { name: /salvar/i }));

		expect(onUpdateObservation).toHaveBeenCalledWith("item-1", "Com catupiry");

		await user.click(screen.getByTitle("Diminuir quantidade"));
		expect(onUpdateQuantity).toHaveBeenCalledWith("item-1", 1);
	});

	it("shows free delivery unlocked message in CartItemList when remaining is 0", async () => {
		const user = userEvent.setup();
		render(
			<CartItemList
				items={[baseItem]}
				totalItems={2}
				subtotal={60}
				remainingForFreeDelivery={0}
				onUpdateQuantity={vi.fn()}
				onRemove={vi.fn()}
				onUpdateObservation={vi.fn()}
				onClearCart={vi.fn()}
			/>,
		);

		expect(screen.getByText(/você ganhou entrega grátis/i)).toBeInTheDocument();

		// Open and cancel clear cart dialog
		await user.click(
			screen.getByRole("button", { name: /esvaziar carrinho/i }),
		);
		await user.click(
			await screen.findByRole("button", { name: /^cancelar$/i }),
		);
	});
});
