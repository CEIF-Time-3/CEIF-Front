"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/products/schemas/product-schema";

interface AdminProductTableProps {
	products: Product[];
	isLoading?: boolean;
	itemsPerPage?: number;
	onToggleAvailability: (id: string) => void;
	onDeleteProduct: (id: string) => void;
	onEditProduct?: (product: Product) => void;
	onResetFilters?: () => void;
}

export const AdminProductTable = ({
	products,
	isLoading = false,
	itemsPerPage = 5,
	onToggleAvailability,
	onDeleteProduct,
	onEditProduct,
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
									{product.badge && (
										<Badge variant="secondary" className="py-0 text-[10px]">
											{product.badge}
										</Badge>
									)}
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
				accessorKey: "category",
				header: "Categoria",
				cell: ({ row }) => (
					<Badge variant="outline" className="font-medium">
						{row.original.category}
					</Badge>
				),
			},
			{
				accessorKey: "isAvailable",
				header: "Status",
				cell: ({ row }) =>
					row.original.isAvailable ? (
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
							<Button
								variant="ghost"
								size="icon"
								onClick={() => onToggleAvailability(product.id)}
								title={
									product.isAvailable
										? "Marcar como indisponível"
										: "Marcar como disponível"
								}
								className="text-muted-foreground hover:text-foreground size-8"
							>
								{product.isAvailable ? (
									<Eye className="size-4 text-emerald-600 dark:text-emerald-400" />
								) : (
									<EyeOff className="size-4 text-rose-500" />
								)}
							</Button>

							{onEditProduct && (
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEditProduct(product)}
									title="Editar produto"
									className="text-muted-foreground hover:text-foreground size-8"
								>
									<Edit className="size-4" />
								</Button>
							)}

							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									if (
										confirm(`Tem certeza que deseja excluir "${product.name}"?`)
									) {
										onDeleteProduct(product.id);
									}
								}}
								title="Excluir produto"
								className="text-muted-foreground hover:text-destructive size-8"
							>
								<Trash2 className="size-4" />
							</Button>
						</div>
					);
				},
			},
		],
		[onToggleAvailability, onDeleteProduct, onEditProduct],
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
