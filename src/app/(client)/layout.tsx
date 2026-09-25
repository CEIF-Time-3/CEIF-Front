import type { Metadata } from "next";
import { ClientHeader } from "@/components/client-header";

export const metadata: Metadata = {
	title: {
		default: "Pastelaria Insignificantissímo",
		template: "%s | Pastelaria Insignificantissímo",
	},
	description: "Área do cliente da Pastelaria Insignificantissímo",
};

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-screen flex-col">
			<ClientHeader />
			<main className="flex-1">{children}</main>
		</div>
	);
}
