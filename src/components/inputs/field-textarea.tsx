"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface FieldTextareaProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Textarea>, "name"> {
	name?: TName | string;
	control?: Control<TFieldValues>;
	label?: React.ReactNode;
	labelRight?: React.ReactNode | ((value: string) => React.ReactNode);
	description?: React.ReactNode;
	error?: string | Array<{ message?: string } | undefined>;
	required?: boolean;
	orientation?: "vertical" | "horizontal" | "responsive";
	containerClassName?: string;
}

const BaseFieldTextarea = ({
	label,
	labelRight,
	description,
	error,
	required,
	orientation = "vertical",
	containerClassName,
	id,
	className,
	...props
}: FieldTextareaProps) => {
	const generatedId = React.useId();
	const textareaId = id || generatedId;
	const isInvalid = Boolean(error);
	const errorsList = typeof error === "string" ? [{ message: error }] : error;

	const resolvedLabelRight =
		typeof labelRight === "function"
			? labelRight(String(props.value ?? ""))
			: labelRight;

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
							htmlFor={textareaId}
							className="text-foreground flex items-center gap-1 text-xs font-semibold"
						>
							{label}
							{required && <span className="text-destructive">*</span>}
						</FieldLabel>
					)}
					{resolvedLabelRight}
				</div>
			)}
			<Textarea
				id={textareaId}
				aria-invalid={isInvalid}
				className={cn(
					"resize-none text-xs transition-all",
					isInvalid && "border-destructive focus-visible:ring-destructive/20",
					className,
				)}
				{...props}
			/>
			{description && <FieldDescription>{description}</FieldDescription>}
			{error && (
				<FieldError errors={errorsList} className="text-[11px] font-medium" />
			)}
		</Field>
	);
};

export const FieldTextarea = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
	control,
	name,
	...props
}: FieldTextareaProps<TFieldValues, TName>) => {
	if (control && name) {
		return (
			<Controller
				name={name as Path<TFieldValues>}
				control={control}
				render={({ field, fieldState }) => (
					<BaseFieldTextarea
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

	return <BaseFieldTextarea name={name} {...props} />;
};
