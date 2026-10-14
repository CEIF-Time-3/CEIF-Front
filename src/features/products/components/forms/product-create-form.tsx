"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { maskitoNumber } from "@maskito/kit";
import { AlertCircle, Loader2, Plus, Utensils } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import {
	FieldInput,
	FieldTextarea,
	ImageInput,
	SelectInput,
} from "@/components/inputs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Categorie } from "@/features/categories/schemas/categories.schema";
import { ProductAvailabilityToggle } from "@/features/products/components/product-availability-toggle";
import {
	type ProductCreateInput,
	productCreateSchema,
} from "@/features/products/schemas/products.schema";
import { useProductStore } from "@/features/products/stores/product.store";

type ProductCreateFormValues = z.input<typeof productCreateSchema>;

export interface ProductCreateFormProps {
	categories?: Categorie[];
	onCreated?: () => void | Promise<void>;
}

export const ProductCreateForm = ({
	categories,
	onCreated,
}: ProductCreateFormProps) => {
	const create = useProductStore((state) => state.create);
	const [open, setOpen] = React.useState(false);

	const resolvedCategoryOptions = React.useMemo(() => {
		if (categories) {
			return categories.map((cat) => ({
				label: cat.name,
				value: cat.id,
			}));
		}
		return [];
	}, [categories]);

	const {
		handleSubmit,
		control,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ProductCreateFormValues, unknown, ProductCreateInput>({
		resolver: zodResolver(productCreateSchema),
	});

	const priceMaskOptions = React.useMemo(
		() =>
			maskitoNumber({
				decimalSeparator: ",",
				thousandSeparator: ".",
				min: 0,
				maximumFractionDigits: 2,
			}),
		[],
	);

	const handleOpenChange = React.useCallback(
		(nextOpen: boolean) => {
			setOpen(nextOpen);
			if (!nextOpen) {
				reset();
			}
		},
		[reset],
	);

	const handleCancel = React.useCallback(() => {
		reset();
		setOpen(false);
	}, [reset]);

	const handleFormSubmit = async (data: ProductCreateInput) => {
		const result = await create(data);
		if (!result.success) {
			setError("root", { message: result.error });
			return;
		}

		reset();
		setOpen(false);
		await onCreated?.();
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger
				render={
					<Button className="h-9 gap-1.5 self-start sm:self-auto">
						<Plus className="size-4" />
						Novo Produto
					</Button>
				}
			/>
			<DialogContent className="w-full max-w-2xl p-6 sm:max-w-2xl">
				<DialogHeader className="pb-1">
					<DialogTitle className="text-lg font-bold">
						Cadastrar Novo Produto
					</DialogTitle>
					<DialogDescription className="text-xs">
						Preencha as informações abaixo para adicionar um novo produto ao
						cardápio.
					</DialogDescription>
				</DialogHeader>
				<div className="mt-1">
					<form
						onSubmit={handleSubmit(handleFormSubmit)}
						className="text-foreground flex flex-col gap-3.5"
					>
						{errors.root?.message && (
							<div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-2 rounded-lg border p-3 text-xs font-medium">
								<AlertCircle className="size-4 shrink-0" />
								<span>{errors.root.message}</span>
							</div>
						)}

						<div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
							{/* Nome do Produto */}
							<FieldInput
								id="name"
								name="name"
								control={control}
								label="Nome do Produto"
								required
								labelRight={(val) => (
									<span className="bg-muted/60 py-0.2 text-muted-foreground rounded-full px-1.5 font-mono text-[10px]">
										{val.length}/255
									</span>
								)}
								placeholder="Ex: Pastel de Carne Especial"
								maxLength={255}
								containerClassName="sm:col-span-2"
							/>

							{/* Preço */}
							<FieldInput
								id="price"
								name="price"
								control={control}
								label="Preço"
								required
								placeholder="0,00"
								maskOptions={priceMaskOptions}
								className="pl-8 font-medium"
								startAddon={
									<div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs font-semibold">
										R$
									</div>
								}
							/>

							{/* Categoria */}
							<SelectInput
								name="categoryId"
								id="categoryId"
								control={control}
								label="Categoria"
								required
								placeholder="Selecione uma categoria"
								options={resolvedCategoryOptions}
								triggerClassName="h-8.5 text-xs"
							/>

							{/* URL da Imagem & Preview */}
							<ImageInput
								id="imageUrl"
								name="imageUrl"
								control={control}
								disabled={isSubmitting}
								containerClassName="sm:col-span-2"
							/>

							{/* Descrição */}
							<FieldTextarea
								id="description"
								name="description"
								control={control}
								label="Descrição"
								labelRight={(val) => (
									<span className="bg-muted/60 py-0.2 text-muted-foreground rounded-full px-1.5 font-mono text-[10px]">
										{val.length}/500
									</span>
								)}
								rows={2}
								placeholder="Descreva os detalhes e diferenciais do produto..."
								maxLength={500}
								className="h-16"
								containerClassName="sm:col-span-2"
							/>

							{/* Ingredientes */}
							<FieldInput
								id="ingredients"
								name="ingredients"
								control={control}
								label={
									<>
										<Utensils className="text-muted-foreground size-3" />
										Ingredientes
									</>
								}
								placeholder="Ex: Carne bovina, queijo mussarela, tempero da casa"
								containerClassName="sm:col-span-2"
							/>

							{/* Availability toggle card */}
							<ProductAvailabilityToggle
								id="available"
								name="available"
								control={control}
								disabled={isSubmitting}
								className="sm:col-span-2"
							/>
						</div>

						{/* Form Actions Footer */}
						<div className="border-border/60 flex items-center justify-end gap-2 border-t pt-3">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleCancel}
								disabled={isSubmitting}
								className="h-8.5 px-3.5 text-xs font-medium"
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								size="sm"
								disabled={isSubmitting}
								className="h-8.5 px-4 text-xs font-semibold shadow-2xs"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-1.5 size-3 animate-spin" />
										Cadastrando...
									</>
								) : (
									<>
										<Plus className="mr-1.5 size-3" />
										Cadastrar Produto
									</>
								)}
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
};
