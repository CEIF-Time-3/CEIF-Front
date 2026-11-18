import type { Metadata } from "next";
import { AdminUserSection } from "@/features/users/components";
import { userService } from "@/services/user.service";

export const metadata: Metadata = {
	title: "Gestão de Usuários | CEIF Admin",
	description:
		"Visualize e gerencie as contas de clientes e administradores da pastelaria.",
};

export default async function AdminUsersPage() {
	const result = await userService.getAll();

	return <AdminUserSection initialUsers={result.success ? result.data : []} />;
}
