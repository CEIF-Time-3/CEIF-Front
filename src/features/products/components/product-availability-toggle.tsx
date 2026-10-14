"use client";

import { CheckCircle2 } from "lucide-react";
import React from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
} from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface ProductAvailabilityToggleProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
	name?: TName | string;
	control?: Control<TFieldValues>;
	id?: string;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	title?: string;
	activeDescription?: string;
	inactiveDescription?: string;
}

const BaseProductAvailabilityToggle = ({
	id,
	checked = true,
	onCheckedChange,
	disabled = false,
	className,
	title = "Disponível para venda",
	activeDescription = "Visível imediatamente no cardápio publicamente.",
	inactiveDescription = "Oculto/indisponível para pedidos.",
}: ProductAvailabilityToggleProps) => {
	const generatedId = React.useId();
	const switchId = id || generatedId;

	return (
		<label
			htmlFor={switchId}
			className={cn(
				"flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-left transition-all select-none",
				checked
					? "border-primary/40 bg-primary/5 shadow-2xs"
					: "border-border bg-muted/20 hover:bg-muted/40",
				disabled && "pointer-events-none opacity-50",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				<CheckCircle2
					className={cn(
						"size-4 transition-colors",
						checked ? "text-primary" : "text-muted-foreground",
					)}
				/>
				<div className="flex flex-col">
					<span className="text-foreground text-xs font-semibold">{title}</span>
					<span className="text-muted-foreground text-[10px]">
						{checked ? activeDescription : inactiveDescription}
					</span>
				</div>
			</div>

			<Switch
				id={switchId}
				checked={checked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
			/>
		</label>
	);
};

export const ProductAvailabilityToggle = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
	control,
	name,
	checked = true,
	...props
}: ProductAvailabilityToggleProps<TFieldValues, TName>) => {
	if (control && name) {
		return (
			<Controller
				name={name as Path<TFieldValues>}
				control={control}
				render={({ field }) => (
					<BaseProductAvailabilityToggle
						{...props}
						id={props.id}
						checked={Boolean(field.value ?? checked)}
						onCheckedChange={(val) => {
							field.onChange(val);
							props.onCheckedChange?.(val);
						}}
					/>
				)}
			/>
		);
	}

	return <BaseProductAvailabilityToggle checked={checked} {...props} />;
};
