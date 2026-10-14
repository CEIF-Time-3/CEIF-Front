"use client";

import type { MaskitoOptions } from "@maskito/core";
import { useMaskito } from "@maskito/react";
import React from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FieldInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Input>, "name"> {
	name?: TName | string;
	control?: Control<TFieldValues>;
	label?: React.ReactNode;
	labelRight?: React.ReactNode | ((value: string) => React.ReactNode);
	description?: React.ReactNode;
	error?: string | Array<{ message?: string } | undefined>;
	required?: boolean;
	orientation?: "vertical" | "horizontal" | "responsive";
	containerClassName?: string;
	startAddon?: React.ReactNode;
	maskOptions?: MaskitoOptions;
	maskitoOptions?: MaskitoOptions;
}

const BaseFieldInput = ({
	label,
	labelRight,
	description,
	error,
	required,
	orientation = "vertical",
	containerClassName,
	startAddon,
	maskOptions,
	maskitoOptions,
	id,
	className,
	ref,
	...props
}: FieldInputProps) => {
	const generatedId = React.useId();
	const inputId = id || generatedId;
	const isInvalid = Boolean(error);
	const errorsList = typeof error === "string" ? [{ message: error }] : error;

	const activeMaskOptions = maskOptions || maskitoOptions;
	const maskitoRef = useMaskito({ options: activeMaskOptions || null });

	const combinedRef = React.useCallback(
		(node: HTMLInputElement | null) => {
			if (activeMaskOptions) {
				maskitoRef(node);
			}
			if (typeof ref === "function") {
				ref(node);
			} else if (ref && typeof ref === "object") {
				(ref as React.RefObject<HTMLInputElement | null>).current = node;
			}
		},
		[maskitoRef, ref, activeMaskOptions],
	);

	const resolvedLabelRight =
		typeof labelRight === "function"
			? labelRight(String(props.value ?? ""))
			: labelRight;

	const inputElement = (
		<Input
			id={inputId}
			ref={combinedRef}
			aria-invalid={isInvalid}
			className={cn(
				"h-8.5 text-xs transition-all",
				isInvalid && "border-destructive focus-visible:ring-destructive/20",
				className,
			)}
			{...props}
		/>
	);

	return (
		<Field
			orientation={orientation}
			data-invalid={isInvalid}
			className={cn("gap-1", containerClassName)}
		>
			{(label || resolvedLabelRight) && (
				<div className="flex items-center justify-between">
					{label && (
						<FieldLabel
							htmlFor={inputId}
							className="text-foreground flex items-center gap-1 text-xs font-semibold"
						>
							{label}
							{required && <span className="text-destructive">*</span>}
						</FieldLabel>
					)}
					{resolvedLabelRight}
				</div>
			)}
			{startAddon ? (
				<div className="relative">
					{startAddon}
					{inputElement}
				</div>
			) : (
				inputElement
			)}
			{description && <FieldDescription>{description}</FieldDescription>}
			{error && (
				<FieldError errors={errorsList} className="text-[11px] font-medium" />
			)}
		</Field>
	);
};

export const FieldInput = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
	control,
	name,
	...props
}: FieldInputProps<TFieldValues, TName>) => {
	if (control && name) {
		return (
			<Controller
				name={name as Path<TFieldValues>}
				control={control}
				render={({ field, fieldState }) => (
					<BaseFieldInput
						{...props}
						{...field}
						id={props.id}
						value={field.value ?? ""}
						onChange={(e) => {
							field.onChange(e);
							props.onChange?.(e);
						}}
						onBlur={(e) => {
							field.onBlur();
							props.onBlur?.(e);
						}}
						error={props.error ?? fieldState.error?.message}
						labelRight={
							typeof props.labelRight === "function"
								? props.labelRight(String(field.value ?? ""))
								: props.labelRight
						}
					/>
				)}
			/>
		);
	}

	return <BaseFieldInput name={name} {...props} />;
};
