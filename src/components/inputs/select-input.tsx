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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface SelectInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
	name?: TName | string;
	control?: Control<TFieldValues>;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	options: (SelectOption | string)[];
	placeholder?: string;
	label?: React.ReactNode;
	labelRight?: React.ReactNode;
	description?: React.ReactNode;
	error?: string | Array<{ message?: string } | undefined>;
	required?: boolean;
	orientation?: "vertical" | "horizontal" | "responsive";
	containerClassName?: string;
	id?: string;
	disabled?: boolean;
	className?: string;
	triggerClassName?: string;
	size?: "sm" | "default";
	side?: "top" | "bottom" | "left" | "right";
	align?: "start" | "center" | "end";
}

const BaseSelectInput = ({
	value,
	defaultValue,
	onValueChange,
	options,
	placeholder = "Selecione uma opção",
	label,
	labelRight,
	description,
	error,
	required = false,
	orientation = "vertical",
	containerClassName,
	id,
	disabled = false,
	className,
	triggerClassName,
	size = "default",
	side = "bottom",
	align = "start",
}: SelectInputProps) => {
	const generatedId = React.useId();
	const selectId = id || generatedId;
	const isInvalid = Boolean(error);
	const errorsList = typeof error === "string" ? [{ message: error }] : error;

	const normalizedOptions: SelectOption[] = React.useMemo(
		() =>
			options.map((opt) =>
				typeof opt === "string" ? { label: opt, value: opt } : opt,
			),
		[options],
	);

	return (
		<Field
			orientation={orientation}
			data-invalid={isInvalid}
			className={cn("gap-1", containerClassName, className)}
		>
			{(label || labelRight) && (
				<div className="flex items-center justify-between">
					{label && (
						<FieldLabel
							htmlFor={selectId}
							className="text-foreground flex items-center gap-1 text-xs font-semibold"
						>
							{label}
							{required && <span className="text-destructive">*</span>}
						</FieldLabel>
					)}
					{labelRight}
				</div>
			)}
			<Select
				value={value}
				defaultValue={defaultValue}
				onValueChange={(val) => {
					if (val !== null && onValueChange) {
						onValueChange(val);
					}
				}}
				disabled={disabled}
			>
				<SelectTrigger
					id={selectId}
					size={size}
					aria-invalid={isInvalid}
					className={cn(
						"bg-background w-full text-xs transition-all",
						isInvalid && "border-destructive focus-visible:ring-destructive/20",
						triggerClassName,
					)}
				>
					<SelectValue placeholder={placeholder}>
						{(selectedValue) => {
							if (!selectedValue) return placeholder;
							const foundOption = normalizedOptions.find(
								(opt) => opt.value === selectedValue,
							);
							return foundOption ? foundOption.label : selectedValue;
						}}
					</SelectValue>
				</SelectTrigger>
				<SelectContent side={side} align={align} className="w-full">
					{normalizedOptions.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
							disabled={option.disabled}
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{description && <FieldDescription>{description}</FieldDescription>}
			{error && (
				<FieldError errors={errorsList} className="text-[11px] font-medium" />
			)}
		</Field>
	);
};

export const SelectInput = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
	control,
	name,
	...props
}: SelectInputProps<TFieldValues, TName>) => {
	if (control && name) {
		return (
			<Controller
				name={name as Path<TFieldValues>}
				control={control}
				render={({ field, fieldState }) => (
					<BaseSelectInput
						{...props}
						id={props.id}
						value={field.value ?? ""}
						onValueChange={(val) => {
							field.onChange(val);
							props.onValueChange?.(val);
						}}
						error={props.error ?? fieldState.error?.message}
					/>
				)}
			/>
		);
	}

	return <BaseSelectInput name={name} {...props} />;
};
