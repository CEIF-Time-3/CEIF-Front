import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CartItemList } from "@/features/cart/components/cart-item-list";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useCartStore } from "@/features/cart/stores/cart.store";
import type { Product } from "@/features/products/schemas/products.schema";

const pastelCarne = {
	id: "p-1",
	name: "Pastel de Carne",
	price: "10,00",
	imageUrl: null,
} as unknown as Product;

const pastelQueijo = {
	id: "p-2",
	name: "Pastel de Queijo",
	price: "12,50",
	imageUrl: null,
} as unknown as Product;

/**
 * Integration harness: wires the real `useCart` hook (and the real zustand
 * store) into the presentational `CartItemList`, as `CartSection` does.
 */
const CartHarness = () => {
	const cart = useCart();
	return (
		<CartItemList
			items={cart.items}
			totalItems={cart.totalItems}
			subtotal={cart.subtotal}
			remainingForFreeDelivery={cart.remainingForFreeDelivery}
			onUpdateQuantity={cart.updateQuantity}
			onRemove={cart.removeItem}
			onUpdateObservation={cart.updateObservation}
			onClearCart={cart.clearCart}
		/>
	);
};

const normalize = (value: string | null) => (value ?? "").replace(/\s/g, " ");

const getItemCard = (name: string) => screen.getByRole("article", { name });

describe("Cart integration (CartItemList + useCart + cart store)", () => {
	beforeEach(() => {
		localStorage.clear();
		useCartStore.setState({ items: [] });
		useCartStore.getState().addItem(pastelCarne, 1);
		useCartStore.getState().addItem(pastelQueijo, 2);
	});

	it("renders items from the store with totals and free delivery progress", async () => {
		render(<CartHarness />);

		expect(
			await screen.findByRole("heading", { name: "Pastel de Carne" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "Pastel de Queijo" }),
		).toBeInTheDocument();
		expect(screen.getByText("3 itens selecionados")).toBeInTheDocument();

		// subtotal = 10 + 2 * 12.5 = 35 → faltam R$ 15,00 (threshold R$ 50)
		const remaining = screen.getByText(/R\$\s15,00/);
		expect(normalize(remaining.textContent)).toBe("R$ 15,00");
		expect(screen.getByText("70%")).toBeInTheDocument();
	});

	it("updates the store and UI when increasing quantity", async () => {
		const user = userEvent.setup();
		render(<CartHarness />);

		await screen.findByRole("heading", { name: "Pastel de Carne" });
		const card = getItemCard("Pastel de Carne");
		await user.click(within(card).getByTitle("Aumentar quantidade"));

		expect(screen.getByText("4 itens selecionados")).toBeInTheDocument();
		expect(
			useCartStore.getState().items.find((i) => i.productId === "p-1")
				?.quantity,
		).toBe(2);
		// subtotal = 45 → faltam R$ 5,00
		expect(screen.getByText(/R\$\s5,00/)).toBeInTheDocument();
	});

	it("removes an item from the cart", async () => {
		const user = userEvent.setup();
		render(<CartHarness />);

		await screen.findByRole("heading", { name: "Pastel de Queijo" });
		const card = getItemCard("Pastel de Queijo");
		await user.click(within(card).getByTitle("Remover item"));

		expect(
			screen.queryByRole("heading", { name: "Pastel de Queijo" }),
		).not.toBeInTheDocument();
		expect(screen.getByText("1 item selecionado")).toBeInTheDocument();
		expect(useCartStore.getState().items).toHaveLength(1);
	});

	it("clears the cart after confirming the dialog", async () => {
		const user = userEvent.setup();
		render(<CartHarness />);

		await user.click(
			await screen.findByRole("button", { name: /esvaziar carrinho/i }),
		);
		await user.click(
			await screen.findByRole("button", { name: "Sim, esvaziar" }),
		);

		expect(useCartStore.getState().items).toHaveLength(0);
		expect(screen.getByText("0 itens selecionados")).toBeInTheDocument();
	});
});
