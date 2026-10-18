"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import { PastelIcon } from "@/components/icons/logo-icon";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart/hooks/use-cart";

export const ClientHeader = () => {
	const { totalItems, isHydrated } = useCart();

	const badgeCount = React.useMemo(() => {
		return totalItems > 99 ? "99+" : totalItems;
	}, [totalItems]);

	return (
		<header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-6">
					<Link
						href="/"
						className="text-primary flex items-center gap-2 text-xl font-bold"
					>
						<PastelIcon className="h-7 w-7 text-amber-500" />
					</Link>
				</div>

				<div className="flex items-center gap-4">
					<Link
						href="/carrinho"
						className="text-muted-foreground hover:text-foreground relative flex items-center gap-2 text-sm font-medium transition-colors"
					>
						<div className="relative flex items-center justify-center">
							<ShoppingBag className="h-5 w-5" />
							{isHydrated && totalItems > 0 && (
								<Badge
									variant="default"
									className="absolute -top-2 -right-2.5 h-4 min-w-4 px-1 text-[10px] font-black leading-none rounded-full flex items-center justify-center shadow-xs"
								>
									{badgeCount}
								</Badge>
							)}
						</div>
						<span className="hidden sm:inline">Carrinho</span>
					</Link>
				</div>
			</div>
		</header>
	);
};
