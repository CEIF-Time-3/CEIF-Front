import type { Metadata } from "next";
import { CartSection } from "@/features/cart/components";

export const metadata: Metadata = {
	title: "Carrinho de Compras",
	description: "Confira seus pastéis e finalize seu pedido com rapidez e segurança.",
};

export default function CartPage() {
	return <CartSection />;
}
