"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { maskitoNumber } from "@maskito/kit";
import { AlertCircle, Edit, Loader2, Utensils } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { FieldInput, FieldTextarea, ImageInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ProductAvailabilityToggle } from "@/features/products/components/product-availability-toggle";
import type {
	Product,
	ProductUpdateInput,
} from "@/features/products/schemas/products.schema";
import { productUpdateSchema } from "@/features/products/schemas/products.schema";
import { useProductStore } from "@/features/products/stores/product.store";

type ProductEditFormValues = z.input<typeof productUpdateSchema>;

interface ProductEditFormProps {
	product: Product;
}

const getProductFormValues = (product: Product): ProductUpdateInput => ({
	name: product.name,
	price: product.price,
	imageUrl: product.imageUrl,
	description: product.description,
	available: product.available,
	ingredients: product.ingredients,
});

export const ProductEditForm = ({ product }: ProductEditFormProps) => {
	const update = useProductStore((state) => state.update);
	const [open, setOpen] = React.useState(false);
	const {
		handleSubmit,
		control,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ProductEditFormValues, unknown, ProductUpdateInput>({
		resolver: zodResolver(productUpdateSchema),
		defaultValues: getProductFormValues(product),
	});

	React.useEffect(() => {
		reset(getProductFormValues(product));
	}, [product, reset]);

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

	const handleFormSubmit = async (data: ProductUpdateInput) => {
		const result = await update(product.id, data);
		if (!result.success) {
			setError("root", { message: result.error });
			return;
		}

		setOpen(false);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) {
			reset(getProductFormValues(product));
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						title="Editar produto"
						className="text-muted-foreground hover:text-foreground size-8"
					>
						<Edit className="size-4" />
					</Button>
				}
			/>
			<DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Editar produto</DialogTitle>
					<DialogDescription>
						Atualize os dados do produto e salve as alterações.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="flex flex-col gap-4"
				>
					{errors.root?.message && (
						<div
							role="alert"
							className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-2 rounded-lg border p-3 text-xs font-medium"
						>
							<AlertCircle className="size-4 shrink-0" />
							<span>{errors.root.message}</span>
						</div>
					)}
					<FieldInput
						id={`edit-product-name-${product.id}`}
						name="name"
						control={control}
						label="Nome do Produto"
						required
						maxLength={255}
					/>
					<FieldInput
						id={`edit-product-price-${product.id}`}
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
					<ImageInput
						id={`edit-product-image-${product.id}`}
						name="imageUrl"
						control={control}
						disabled={isSubmitting}
					/>
					<FieldTextarea
						id={`edit-product-description-${product.id}`}
						name="description"
						control={control}
						label="Descrição"
						rows={3}
						maxLength={500}
					/>
					<FieldInput
						id={`edit-product-ingredients-${product.id}`}
						name="ingredients"
						control={control}
						label={
							<>
								<Utensils className="text-muted-foreground size-3" />
								Ingredientes
							</>
						}
					/>
					<ProductAvailabilityToggle
						id={`edit-product-available-${product.id}`}
						name="available"
						control={control}
						disabled={isSubmitting}
					/>
					<div className="flex justify-end gap-2 border-t pt-3">
						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting}
							onClick={() => handleOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-1.5 size-4 animate-spin" />
									Salvando...
								</>
							) : (
								"Salvar alterações"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
