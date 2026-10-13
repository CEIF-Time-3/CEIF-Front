"use client";

import { Package, Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Categorie } from "@/features/categories/schemas/categorie-schema";
import {
	AdminProductFilters,
	AdminProductStats,
	AdminProductTable,
	ProductCreateForm,
	type ProductStatusFilter,
} from "@/features/products/components";
import type {
	Product,
	ProductCreateInput,
} from "@/features/products/schemas/product-schema";
import {
	productCreateSchema,
	productSchema,
} from "@/features/products/schemas/product-schema";
import { productService as createProductService } from "@/features/products/services/create-products";
import { productService } from "@/features/products/services/product.service";

interface AdminProductSectionProps {
	initialProducts?: Product[];
	initialCategories?: Categorie[];
}

type ConfirmationAction = "delete" | "availability";

const getEmptyProductForm = (categoryId = ""): ProductCreateInput => ({
	name: "",
	price: "",
	categoryId,
	imageUrl: "",
	description: "",
	available: true,
	ingredients: "",
});

export const AdminProductSection = ({
	initialProducts,
	initialCategories,
}: AdminProductSectionProps) => {
	const [products, setProducts] = React.useState<Product[]>(
		initialProducts ?? [],
	);
	const [categories] = React.useState<Categorie[]>(initialCategories ?? []);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState("Todos");
	const [statusFilter, setStatusFilter] =
		React.useState<ProductStatusFilter>("all");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
	const [formData, setFormData] = React.useState<ProductCreateInput>(() =>
		getEmptyProductForm(categories[0]?.id),
	);
	const [formError, setFormError] = React.useState<string | null>(null);
	const [pageError, setPageError] = React.useState<string | null>(null);
	const [editingProduct, setEditingProduct] = React.useState<Product | null>(
		null,
	);
	const [editError, setEditError] = React.useState<string | null>(null);
	const [confirmation, setConfirmation] = React.useState<{
		product: Product;
		action: ConfirmationAction;
	} | null>(null);
	const [actionError, setActionError] = React.useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleFormChange = React.useCallback(
		(field: keyof ProductCreateInput, value: string | boolean) => {
			setFormData((previous) => ({ ...previous, [field]: value }));
		},
		[],
	);

	const filteredProducts = React.useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return products.filter((product) => {
			const matchesSearch =
				query === "" ||
				product.name.toLowerCase().includes(query) ||
				product.description?.toLowerCase().includes(query) === true ||
				product.ingredients?.toLowerCase().includes(query) === true;
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "available" && product.available) ||
				(statusFilter === "unavailable" && !product.available);

			return matchesSearch && matchesStatus;
		});
	}, [products, searchQuery, statusFilter]);

	const handleFormSubmit = async (
		event: React.SubmitEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		const validation = productCreateSchema.safeParse(formData);
		if (!validation.success) {
			setFormError(validation.error.issues[0]?.message ?? "Dados inválidos.");
			return;
		}

		setIsSubmitting(true);
		setFormError(null);
		setPageError(null);
		try {
			await createProductService.create(validation.data);
			const result = await productService.getAll();
			if (!result.success) {
				setPageError(
					`Produto criado, mas a listagem não pôde ser atualizada: ${result.error}`,
				);
			} else {
				setProducts(result.data);
			}
			setIsCreateDialogOpen(false);
			setFormData(getEmptyProductForm(categories[0]?.id));
		} catch (error) {
			setFormError(
				error instanceof Error ? error.message : "Falha ao criar produto.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteProduct = async () => {
		if (confirmation?.action !== "delete") return;

		setIsSubmitting(true);
		setActionError(null);
		try {
			const result = await productService.deleteProduct(
				confirmation.product.id,
			);
			if (!result.success) {
				throw new Error(result.error);
			}

			setProducts((currentProducts) =>
				currentProducts.filter(
					(product) => product.id !== confirmation.product.id,
				),
			);
			setConfirmation(null);
		} catch (error) {
			setActionError(
				error instanceof Error ? error.message : "Falha ao excluir o produto.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const openConfirmation = (product: Product, action: ConfirmationAction) => {
		setActionError(null);
		setConfirmation({ product, action });
	};

	const handleEditSubmit = async (
		event: React.SubmitEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		if (!editingProduct) return;

		const validation = productSchema.safeParse(editingProduct);
		if (!validation.success) {
			setEditError(validation.error.issues[0]?.message ?? "Dados inválidos.");
			return;
		}

		setEditError(
			"A API ainda não oferece atualização de produtos. O backend precisa disponibilizar PUT /products/:id e retornar categoryId na listagem.",
		);
	};

	return (
		<div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 p-4 md:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
						<Package className="size-4" />
						<span>Painel de Administração</span>
					</div>
					<h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
						Gestão de Produtos
					</h1>
					<p className="text-muted-foreground text-sm">
						Gerencie, pesquise e controle a disponibilidade dos itens do
						cardápio.
					</p>
				</div>

				<Button
					onClick={() => {
						setFormError(null);
						setIsCreateDialogOpen(true);
					}}
					className="h-9 gap-1.5 self-start sm:self-auto"
				>
					<Plus className="size-4" />
					Novo Produto
				</Button>
			</div>

			{pageError && (
				<div role="alert" className="text-destructive text-sm">
					{pageError}
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
				onResetFilters={() => {
					setSearchQuery("");
					setSelectedCategory("Todos");
					setStatusFilter("all");
				}}
			/>

			<AdminProductTable
				products={filteredProducts}
				onToggleAvailability={(product) =>
					openConfirmation(product, "availability")
				}
				onDeleteProduct={(product) => openConfirmation(product, "delete")}
				onEditProduct={(product) => {
					setEditError(null);
					setEditingProduct(product);
				}}
				onResetFilters={() => {
					setSearchQuery("");
					setSelectedCategory("Todos");
					setStatusFilter("all");
				}}
			/>

			<Dialog
				open={isCreateDialogOpen}
				onOpenChange={(open) => {
					if (!isSubmitting) setIsCreateDialogOpen(open);
				}}
			>
				<DialogContent
					className="w-full max-w-2xl p-6 sm:max-w-2xl"
					showCloseButton={!isSubmitting}
				>
					<DialogHeader className="pb-1">
						<DialogTitle className="text-lg font-bold">
							Cadastrar Novo Produto
						</DialogTitle>
						<DialogDescription className="text-xs">
							Preencha as informações abaixo para adicionar um novo produto ao
							cardápio.
						</DialogDescription>
					</DialogHeader>
					<ProductCreateForm
						formData={formData}
						categories={categories.map((category) => ({
							id: category.id,
							name: category.name,
						}))}
						onChange={handleFormChange}
						onSubmit={handleFormSubmit}
						onCancel={() => setIsCreateDialogOpen(false)}
						isSubmitting={isSubmitting}
					/>
					{formError && (
						<p role="alert" className="text-destructive text-sm">
							{formError}
						</p>
					)}
				</DialogContent>
			</Dialog>

			<Dialog
				open={editingProduct !== null}
				onOpenChange={(open) => {
					if (!open && !isSubmitting) setEditingProduct(null);
				}}
			>
				<DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto p-6 sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Editar produto</DialogTitle>
						<DialogDescription>
							Revise os dados do produto. A edição ficará disponível quando a
							API de atualização estiver integrada.
						</DialogDescription>
					</DialogHeader>
					{editingProduct && (
						<form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
							<div className="flex flex-col gap-1.5 text-sm font-medium">
								<label htmlFor="edit-product-name">Nome</label>
								<Input
									id="edit-product-name"
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
								<label htmlFor="edit-product-price">Preço</label>
								<Input
									id="edit-product-price"
									required
									value={editingProduct.price}
									onChange={(event) =>
										setEditingProduct({
											...editingProduct,
											price: event.target.value,
										})
									}
								/>
							</div>
							<div className="flex flex-col gap-1.5 text-sm font-medium">
								<label htmlFor="edit-product-description">Descrição</label>
								<textarea
									id="edit-product-description"
									value={editingProduct.description ?? ""}
									onChange={(event) =>
										setEditingProduct({
											...editingProduct,
											description: event.target.value || null,
										})
									}
									className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3"
								/>
							</div>
							<div className="flex flex-col gap-1.5 text-sm font-medium">
								<label htmlFor="edit-product-image">URL da imagem</label>
								<Input
									id="edit-product-image"
									value={editingProduct.imageUrl ?? ""}
									onChange={(event) =>
										setEditingProduct({
											...editingProduct,
											imageUrl: event.target.value || null,
										})
									}
								/>
							</div>
							<div className="flex flex-col gap-1.5 text-sm font-medium">
								<label htmlFor="edit-product-ingredients">Ingredientes</label>
								<Input
									id="edit-product-ingredients"
									value={editingProduct.ingredients ?? ""}
									onChange={(event) =>
										setEditingProduct({
											...editingProduct,
											ingredients: event.target.value || null,
										})
									}
								/>
							</div>
							{editError && (
								<p role="alert" className="text-destructive text-sm">
									{editError}
								</p>
							)}
							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="outline"
									disabled={isSubmitting}
									onClick={() => setEditingProduct(null)}
								>
									Fechar
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									Salvar alterações
								</Button>
							</div>
						</form>
					)}
				</DialogContent>
			</Dialog>

			<Dialog
				open={confirmation !== null}
				onOpenChange={(open) => {
					if (!open && !isSubmitting) setConfirmation(null);
				}}
			>
				<DialogContent showCloseButton={!isSubmitting}>
					<DialogHeader>
						<DialogTitle>
							{confirmation?.action === "delete"
								? "Excluir produto?"
								: confirmation?.product.available
									? "Ocultar produto?"
									: "Tornar produto visível?"}
						</DialogTitle>
						<DialogDescription>
							{confirmation?.action === "delete"
								? `Tem certeza que deseja excluir "${confirmation.product.name}"? Esta ação não pode ser desfeita.`
								: `Alterar a visibilidade de "${confirmation?.product.name}" exige suporte da API ainda não disponível.`}
						</DialogDescription>
					</DialogHeader>
					{actionError && (
						<p role="alert" className="text-destructive text-sm">
							{actionError}
						</p>
					)}
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting}
							onClick={() => setConfirmation(null)}
						>
							Cancelar
						</Button>
						{confirmation?.action === "delete" ? (
							<Button
								type="button"
								variant="destructive"
								disabled={isSubmitting}
								onClick={() => void handleDeleteProduct()}
							>
								{isSubmitting ? "Excluindo..." : "Excluir produto"}
							</Button>
						) : (
							<Button
								type="button"
								disabled
								title="A API ainda não fornece uma rota para alterar a visibilidade."
							>
								API indisponível
							</Button>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
