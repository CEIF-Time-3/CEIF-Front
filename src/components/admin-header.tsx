"use client";

import Link from "next/link";
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

const defaultBreadcrumbs: BreadcrumbItemType[] = [
	{ label: "Admin", href: "/admin" },
	{ label: "Dashboard" },
];

export const AdminHeader = ({
	breadcrumbs = defaultBreadcrumbs,
}: AdminHeaderProps) => {
	return (
		<header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm transition-all">
			<div className="flex items-center gap-3">
				<SidebarTrigger />
				<Separator orientation="vertical" className="h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((item, index) => {
							const isLast = index === breadcrumbs.length - 1;

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
