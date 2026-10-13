"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Package } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	AdminProductFilters,
	AdminProductStats,
	AdminProductTable,
} from "@/features/products/components";
import { useProducts } from "@/features/products/hooks/use-products";
import {
	type Product,
	productSchema,
} from "@/features/products/schemas/product-schema";

type ProductConfirmation = {
	product: Product;
	action: "delete" | "availability";
};

interface AdminProductSectionProps {
	initialProducts?: Product[];
	initialCategories?: string[];
}

export const AdminProductSection = ({
	initialProducts,
	initialCategories,
}: AdminProductSectionProps) => {
	const {
		products,
		filteredProducts,
		categories,
		isLoading,
		searchQuery,
		selectedCategory,
		statusFilter,
		setSearchQuery,
		setSelectedCategory,
		setStatusFilter,
		toggleAvailability,
		deleteProduct,
		updateProduct,
		resetFilters,
		refetch,
		error: storeError,
	} = useProducts(initialProducts, initialCategories);
	const [editingProduct, setEditingProduct] = React.useState<Product | null>(
		null,
	);
	const [confirmation, setConfirmation] =
		React.useState<ProductConfirmation | null>(null);
	const [formError, setFormError] = React.useState<string | null>(null);
	const [actionError, setActionError] = React.useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleEditProduct = (product: Product) => {
		setFormError(null);
		setEditingProduct(product);
	};

	const handleUpdateProduct = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		if (!editingProduct) return;

		const validation = productSchema.safeParse(editingProduct);
		if (!validation.success) {
			setFormError(validation.error.issues[0]?.message ?? "Dados inválidos.");
			return;
		}

		setIsSubmitting(true);
		setFormError(null);
		try {
			await updateProduct(validation.data);
			setEditingProduct(null);
		} catch (err) {
			setFormError(
				err instanceof Error ? err.message : "Erro ao atualizar o produto.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleConfirmAction = async () => {
		if (!confirmation) return;

		setIsSubmitting(true);
		setActionError(null);
		try {
			if (confirmation.action === "delete") {
				await deleteProduct(confirmation.product.id);
			} else {
				await toggleAvailability(confirmation.product.id);
			}
			setConfirmation(null);
		} catch (err) {
			setActionError(
				err instanceof Error
					? err.message
					: "Não foi possível concluir a ação.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const openConfirmation = (
		product: Product,
		action: "delete" | "availability",
	) => {
		setActionError(null);
		setConfirmation({ product, action });
	};

	return (
		<div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 p-4 md:p-6">
			<div className="flex flex-col gap-1">
				<div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
					<Package className="size-4" />
					<span>Painel de Administração</span>
				</div>
				<h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
					Gestão de Produtos
				</h1>
				<p className="text-muted-foreground text-sm">
					Gerencie, pesquise e controle a disponibilidade dos itens do cardápio.
				</p>
			</div>

			{storeError && (
				<div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between rounded-xl border p-4 text-sm">
					<span>{storeError}</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => refetch()}
						className="hover:bg-destructive/20 text-xs"
					>
						Tentar novamente
					</Button>
				</div>
			)}

			<AdminProductStats products={products} categories={categories} />

			<AdminProductFilters
				searchQuery={searchQuery}
				selectedCategory={selectedCategory}
				statusFilter={statusFilter}
				categories={categories}
				onSearchChange={setSearchQuery}
				onCategoryChange={setSelectedCategory}
				onStatusFilterChange={setStatusFilter}
				onResetFilters={resetFilters}
			/>

			<AdminProductTable
				products={filteredProducts}
				isLoading={isLoading}
				onToggleAvailability={(product) =>
					openConfirmation(product, "availability")
				}
				onDeleteProduct={(product) => openConfirmation(product, "delete")}
				onEditProduct={handleEditProduct}
				onResetFilters={resetFilters}
			/>

			<DialogPrimitive.Root
				open={editingProduct !== null}
				onOpenChange={(open) => {
					if (!open && !isSubmitting) setEditingProduct(null);
				}}
			>
				<DialogPrimitive.Portal>
					<DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs data-ending-style:opacity-0 data-starting-style:opacity-0" />
					<DialogPrimitive.Popup className="bg-popover text-popover-foreground fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border p-6 shadow-xl outline-none">
						<DialogPrimitive.Title className="text-lg font-semibold">
							Editar produto
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
							Atualize as informações do produto e salve as alterações.
						</DialogPrimitive.Description>
						{editingProduct && (
							<form
								onSubmit={handleUpdateProduct}
								className="mt-5 flex flex-col gap-4"
							>
								<div className="flex flex-col gap-1.5 text-sm font-medium">
									<label htmlFor="product-name">Nome</label>
									<Input
										id="product-name"
										required
										value={editingProduct.name}
										onChange={(event) =>
											setEditingProduct({
												...editingProduct,
												name: event.target.value,
											})
										}
									/>
								</div>
								<div className="flex flex-col gap-1.5 text-sm font-medium">
									<label htmlFor="product-description">Descrição</label>
									<textarea
										id="product-description"
										required
										value={editingProduct.description}
										onChange={(event) =>
											setEditingProduct({
												...editingProduct,
												description: event.target.value,
											})
										}
										className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3"
									/>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="flex flex-col gap-1.5 text-sm font-medium">
										<label htmlFor="product-price">Preço</label>
										<Input
											id="product-price"
											required
											type="number"
											min="0.01"
											step="0.01"
											value={editingProduct.price}
											onChange={(event) =>
												setEditingProduct({
													...editingProduct,
													price: Number(event.target.value),
												})
											}
										/>
									</div>
									<div className="flex flex-col gap-1.5 text-sm font-medium">
										<label htmlFor="product-category">Categoria</label>
										<Input
											id="product-category"
											required
											value={editingProduct.category}
											onChange={(event) =>
												setEditingProduct({
													...editingProduct,
													category: event.target.value,
												})
											}
										/>
									</div>
								</div>
								<div className="flex flex-col gap-1.5 text-sm font-medium">
									<label htmlFor="product-image-url">URL da imagem</label>
									<Input
										id="product-image-url"
										type="url"
										value={editingProduct.imageUrl ?? ""}
										onChange={(event) =>
											setEditingProduct({
												...editingProduct,
												imageUrl: event.target.value,
											})
										}
									/>
								</div>
								{formError && (
									<p role="alert" className="text-destructive text-sm">
										{formError}
									</p>
								)}
								<div className="flex justify-end gap-2">
									<Button
										type="button"
										variant="outline"
										disabled={isSubmitting}
										onClick={() => setEditingProduct(null)}
									>
										Cancelar
									</Button>
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? "Salvando..." : "Salvar alterações"}
									</Button>
								</div>
							</form>
						)}
					</DialogPrimitive.Popup>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>

			<DialogPrimitive.Root
				open={confirmation !== null}
				onOpenChange={(open) => {
					if (!open && !isSubmitting) setConfirmation(null);
				}}
			>
				<DialogPrimitive.Portal>
					<DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs data-ending-style:opacity-0 data-starting-style:opacity-0" />
					<DialogPrimitive.Popup className="bg-popover text-popover-foreground fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border p-6 shadow-xl outline-none">
						<DialogPrimitive.Title className="text-lg font-semibold">
							{confirmation?.action === "delete"
								? "Excluir produto?"
								: confirmation?.product.isAvailable
									? "Ocultar produto?"
									: "Tornar produto visível?"}
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="text-muted-foreground mt-2 text-sm">
							{confirmation?.action === "delete"
								? `Tem certeza que deseja excluir "${confirmation.product.name}"? Esta ação não pode ser desfeita.`
								: confirmation?.product.isAvailable
									? `O produto "${confirmation.product.name}" deixará de ficar disponível no cardápio.`
									: `O produto "${confirmation?.product.name}" ficará disponível no cardápio.`}
						</DialogPrimitive.Description>
						{actionError && (
							<p role="alert" className="text-destructive mt-3 text-sm">
								{actionError}
							</p>
						)}
						<div className="mt-6 flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								disabled={isSubmitting}
								onClick={() => setConfirmation(null)}
							>
								Cancelar
							</Button>
							<Button
								type="button"
								variant={
									confirmation?.action === "delete" ? "destructive" : "default"
								}
								disabled={isSubmitting}
								onClick={handleConfirmAction}
							>
								{isSubmitting
									? "Processando..."
									: confirmation?.action === "delete"
										? "Excluir produto"
										: confirmation?.product.isAvailable
											? "Ocultar produto"
											: "Tornar visível"}
							</Button>
						</div>
					</DialogPrimitive.Popup>
				</DialogPrimitive.Portal>
			</DialogPrimitive.Root>
		</div>
	);
};
