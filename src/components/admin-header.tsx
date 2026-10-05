"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export interface BreadcrumbItemType {
	label: string;
	href?: string;
}

export interface AdminHeaderProps {
	breadcrumbs?: BreadcrumbItemType[];
}

const ROUTE_LABELS: Record<string, string> = {
	admin: "Administrativo",
	dashboard: "Dashboard",
	produtos: "Produtos",
	pedidos: "Pedidos",
	configuracoes: "Configurações",
	usuarios: "Usuários",
};

const getBreadcrumbsFromPathname = (pathname: string): BreadcrumbItemType[] => {
	const segments = pathname.split("/").filter(Boolean);
	if (
		segments.length === 0 ||
		(segments.length === 1 && segments[0] === "admin")
	) {
		return [
			{ label: "Administrativo", href: "/admin" },
			{ label: "Dashboard" },
		];
	}

	const items: BreadcrumbItemType[] = [];
	let currentPath = "";

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		currentPath += `/${segment}`;
		const label =
			ROUTE_LABELS[segment] ||
			segment.charAt(0).toUpperCase() + segment.slice(1);
		const isLast = i === segments.length - 1;

		items.push({
			label,
			href: isLast ? undefined : currentPath,
		});
	}

	return items;
};

export const AdminHeader = ({ breadcrumbs }: AdminHeaderProps) => {
	const pathname = usePathname();
	const activeBreadcrumbs = breadcrumbs || getBreadcrumbsFromPathname(pathname);

	return (
		<header className="border-border bg-background/95 sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-sm transition-all">
			<div className="flex items-center gap-3">
				<SidebarTrigger />
				<Separator orientation="vertical" className="h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						{activeBreadcrumbs.map((item, index) => {
							const isLast = index === activeBreadcrumbs.length - 1;

							return (
								<div
									key={item.href || item.label}
									className="flex items-center gap-1.5"
								>
									<BreadcrumbItem>
										{isLast || !item.href ? (
											<BreadcrumbPage>{item.label}</BreadcrumbPage>
										) : (
											<BreadcrumbLink render={<Link href={item.href} />}>
												{item.label}
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</div>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
};
