import type { Metadata } from "next";
import { AdminOrderSection } from "@/features/orders/components";
import { ordersService } from "@/services/orders.service";

export const metadata: Metadata = {
	title: "Gestão de Pedidos | CEIF Admin",
	description:
		"Acompanhe e gerencie os pedidos realizados na pastelaria em tempo real.",
};

export default async function AdminPedidosPage() {
	const result = await ordersService.getAll();

	return (
		<AdminOrderSection initialOrders={result.success ? result.data : []} />
	);
}
