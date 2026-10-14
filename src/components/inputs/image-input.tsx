"use client";

import { AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ImageInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends Omit<
		React.ComponentProps<typeof Input>,
		"value" | "onChange" | "name"
	> {
	name?: TName | string;
	control?: Control<TFieldValues>;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onValueChange?: (value: string) => void;
	label?: React.ReactNode;
	labelRight?: React.ReactNode;
	error?: string | Array<{ message?: string } | undefined>;
	required?: boolean;
	containerClassName?: string;
	previewAlt?: string;
	onImageError?: () => void;
}

const BaseImageInput = ({
	id,
	value = "",
	onChange,
	onValueChange,
	label,
	labelRight,
	error,
	required = false,
	placeholder = "https://exemplo.com/imagem.jpg",
	containerClassName,
	previewAlt = "Prévia",
	className,
	disabled = false,
	onImageError,
	...props
}: ImageInputProps) => {
	const generatedId = React.useId();
	const inputId = id || generatedId;
	const [hasImageError, setHasImageError] = React.useState(false);
	const [prevValue, setPrevValue] = React.useState(value);

	if (prevValue !== value) {
		setPrevValue(value);
		setHasImageError(false);
	}

	const isInvalid = Boolean(error);
	const errorMessage =
		typeof error === "string"
			? error
			: Array.isArray(error)
				? error[0]?.message
				: undefined;

	const handleInputChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setHasImageError(false);
			onChange?.(e);
			onValueChange?.(e.target.value);
		},
		[onChange, onValueChange],
	);

	const handleImageError = React.useCallback(() => {
		setHasImageError(true);
		onImageError?.();
	}, [onImageError]);

	const hasValidPreview = Boolean(value) && !isInvalid && !hasImageError;

	return (
		<div className={cn("flex flex-col gap-1", containerClassName)}>
			<div className="flex items-center justify-between">
				{label !== null && (
					<label
						htmlFor={inputId}
						className="text-foreground flex items-center gap-1 text-xs font-semibold"
					>
						{label ?? (
							<>
								<ImageIcon className="text-muted-foreground size-3" />
								<span>URL da Imagem</span>
							</>
						)}
						{required && <span className="text-destructive">*</span>}
					</label>
				)}
				{labelRight ??
					(hasValidPreview ? (
						<span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
							<CheckCircle2 className="size-3" /> Prévia OK
						</span>
					) : null)}
			</div>

			<div className="flex items-center gap-2">
				<Input
					id={inputId}
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={handleInputChange}
					disabled={disabled}
					aria-invalid={isInvalid}
					className={cn(
						"h-8.5 flex-1 text-xs transition-all",
						isInvalid && "border-destructive focus-visible:ring-destructive/20",
						className,
					)}
					{...props}
				/>
				{value && !isInvalid && (
					<div className="border-border bg-background relative flex size-8.5 shrink-0 items-center justify-center overflow-hidden rounded-md border">
						{!hasImageError ? (
							<Image
								src={value}
								alt={previewAlt}
								fill
								unoptimized
								className="object-cover"
								onError={handleImageError}
							/>
						) : (
							<AlertCircle className="text-destructive size-3.5" />
						)}
					</div>
				)}
			</div>

			{errorMessage && (
				<p className="text-destructive flex items-center gap-1 text-[11px] font-medium">
					<AlertCircle className="size-3 shrink-0" />
					<span>{errorMessage}</span>
				</p>
			)}
		</div>
	);
};

export const ImageInput = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
	control,
	name,
	...props
}: ImageInputProps<TFieldValues, TName>) => {
	if (control && name) {
		return (
			<Controller
				name={name as Path<TFieldValues>}
				control={control}
				render={({ field, fieldState }) => (
					<BaseImageInput
						{...props}
						id={props.id}
						value={field.value ?? ""}
						onChange={(e) => {
							field.onChange(e);
							props.onChange?.(e);
							props.onValueChange?.(e.target.value);
						}}
						onBlur={field.onBlur}
						error={props.error ?? fieldState.error?.message}
					/>
				)}
			/>
		);
	}

	return <BaseImageInput name={name} {...props} />;
};
