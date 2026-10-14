"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import React from "react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import {
	ProductAvailabilityDialog,
	ProductDeleteDialog,
	ProductEditForm,
} from "@/features/products/components/forms";
import type { Product } from "@/features/products/schemas/products.schema";
import { formatPrice } from "@/utils/format-price";

interface AdminProductTableProps {
	products: Product[];
	isLoading?: boolean;
	itemsPerPage?: number;
	onResetFilters?: () => void;
}

export const AdminProductTable = ({
	products,
	isLoading = false,
	itemsPerPage = 5,
	onResetFilters,
}: AdminProductTableProps) => {
	const columns = React.useMemo<ColumnDef<Product>[]>(
		() => [
			{
				id: "productInfo",
				header: "Produto",
				cell: ({ row }) => {
					const product = row.original;
					return (
						<div className="flex items-center gap-3">
							<div className="border-border bg-muted relative size-12 shrink-0 overflow-hidden rounded-lg border">
								{product.imageUrl ? (
									<Image
										src={product.imageUrl}
										alt={product.name}
										fill
										sizes="48px"
										className="object-cover"
									/>
								) : (
									<div className="text-muted-foreground flex size-full items-center justify-center text-xs">
										Sem foto
									</div>
								)}
							</div>
							<div className="flex flex-col gap-0.5">
								<div className="flex items-center gap-1.5">
									<span className="text-foreground text-sm font-semibold">
										{product.name}
									</span>
								</div>
								<p className="text-muted-foreground line-clamp-1 max-w-70 text-xs">
									{product.description}
								</p>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "price",
				header: "Preço",
				cell: ({ row }) => (
					<span className="text-foreground text-sm font-semibold">
						{formatPrice(row.original.price)}
					</span>
				),
			},
			{
				accessorKey: "available",
				header: "Status",
				cell: ({ row }) =>
					row.original.available ? (
						<Badge
							variant="default"
							className="border-emerald-500/20 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400"
						>
							Disponível
						</Badge>
					) : (
						<Badge
							variant="destructive"
							className="border-rose-500/20 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:text-rose-400"
						>
							Indisponível
						</Badge>
					),
			},
			{
				id: "actions",
				header: () => <div className="text-right">Ações</div>,
				cell: ({ row }) => {
					const product = row.original;
					return (
						<div className="flex items-center justify-end gap-1.5">
							<ProductAvailabilityDialog product={product} />
							<ProductEditForm product={product} />
							<ProductDeleteDialog product={product} />
						</div>
					);
				},
			},
		],
		[],
	);

	return (
		<DataTable
			columns={columns}
			data={products}
			isLoading={isLoading}
			pageSize={itemsPerPage}
			emptyMessage="Nenhum produto encontrado correspondente aos filtros."
			onResetFilters={onResetFilters}
		/>
	);
};
