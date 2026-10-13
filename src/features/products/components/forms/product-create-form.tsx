"use client";

import { maskitoNumber } from "@maskito/kit";
import { Loader2, Plus, Utensils } from "lucide-react";
import React from "react";

import {
	FieldInput,
	FieldTextarea,
	ImageInput,
	SelectInput,
	type SelectOption,
} from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { ProductAvailabilityToggle } from "@/features/products/components/product-availability-toggle";
import type { ProductCreateInput } from "@/features/products/schemas/product-schema";
import { cn } from "@/lib/utils";
import type { Category } from "@/mocks/products";

export interface ProductCreateFormProps {
	formData?: ProductCreateInput;
	errors?: Partial<Record<keyof ProductCreateInput, string>>;
	categoryOptions?: (SelectOption | string)[];
	categories?: Category[];
	onChange?: (field: keyof ProductCreateInput, value: string | boolean) => void;
	onSubmit?: (e: React.SubmitEvent<HTMLFormElement>) => void;
	onCancel?: () => void;
	isSubmitting?: boolean;
	className?: string;
}

const defaultFormData: ProductCreateInput = {
	name: "",
	price: "",
	categoryId: "",
	imageUrl: "",
	description: "",
	available: true,
	ingredients: "",
};

export const ProductCreateForm = ({
	formData = defaultFormData,
	errors = {},
	categoryOptions,
	categories,
	onChange,
	onSubmit,
	onCancel,
	isSubmitting = false,
	className,
}: ProductCreateFormProps) => {
	const nameId = React.useId();
	const priceId = React.useId();
	const categoryIdId = React.useId();
	const imageUrlId = React.useId();
	const descriptionId = React.useId();
	const ingredientsId = React.useId();
	const availableId = React.useId();

	const resolvedCategoryOptions = React.useMemo(() => {
		if (categoryOptions) return categoryOptions;
		if (categories) {
			return categories.map((cat) => ({
				label: cat.name,
				value: cat.id,
			}));
		}
		return [];
	}, [categoryOptions, categories]);

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

	return (
		<form
			onSubmit={onSubmit}
			className={cn("text-foreground flex flex-col gap-3.5", className)}
		>
			<div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
				{/* Nome do Produto */}
				<FieldInput
					id={nameId}
					label="Nome do Produto"
					required
					labelRight={
						<span className="bg-muted/60 py-0.2 text-muted-foreground rounded-full px-1.5 font-mono text-[10px]">
							{formData.name.length}/255
						</span>
					}
					placeholder="Ex: Pastel de Carne Especial"
					maxLength={255}
					value={formData.name}
					onChange={(e) => onChange?.("name", e.target.value)}
					error={errors.name}
					containerClassName="sm:col-span-2"
				/>

				{/* Preço */}
				<FieldInput
					id={priceId}
					label="Preço"
					required
					placeholder="0,00"
					value={formData.price}
					onChange={(e) => onChange?.("price", e.target.value)}
					error={errors.price}
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
					id={categoryIdId}
					label="Categoria"
					required
					placeholder="Selecione uma categoria"
					value={formData.categoryId}
					onValueChange={(val) => onChange?.("categoryId", val)}
					options={resolvedCategoryOptions}
					error={errors.categoryId}
					triggerClassName="h-8.5 text-xs"
				/>

				{/* URL da Imagem & Preview */}
				<ImageInput
					id={imageUrlId}
					value={formData.imageUrl || ""}
					onChange={(e) => onChange?.("imageUrl", e.target.value)}
					error={errors.imageUrl}
					disabled={isSubmitting}
					containerClassName="sm:col-span-2"
				/>

				{/* Descrição */}
				<FieldTextarea
					id={descriptionId}
					label="Descrição"
					labelRight={
						<span className="bg-muted/60 py-0.2 text-muted-foreground rounded-full px-1.5 font-mono text-[10px]">
							{(formData.description || "").length}/500
						</span>
					}
					rows={2}
					placeholder="Descreva os detalhes e diferenciais do produto..."
					maxLength={500}
					value={formData.description || ""}
					onChange={(e) => onChange?.("description", e.target.value)}
					error={errors.description}
					className="h-16"
					containerClassName="sm:col-span-2"
				/>

				{/* Ingredientes */}
				<FieldInput
					id={ingredientsId}
					label={
						<>
							<Utensils className="text-muted-foreground size-3" />
							Ingredientes
						</>
					}
					placeholder="Ex: Carne bovina, queijo mussarela, tempero da casa"
					value={formData.ingredients || ""}
					onChange={(e) => onChange?.("ingredients", e.target.value)}
					error={errors.ingredients}
					containerClassName="sm:col-span-2"
				/>

				{/* Availability toggle card */}
				<ProductAvailabilityToggle
					id={availableId}
					checked={formData.available}
					onCheckedChange={(checked) => onChange?.("available", checked)}
					disabled={isSubmitting}
					className="sm:col-span-2"
				/>
			</div>

			{/* Form Actions Footer */}
			<div className="border-border/60 flex items-center justify-end gap-2 border-t pt-3">
				{onCancel && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onCancel}
						disabled={isSubmitting}
						className="h-8.5 px-3.5 text-xs font-medium"
					>
						Cancelar
					</Button>
				)}
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
	);
};
