"use client";

import { CheckCircle2 } from "lucide-react";
import React from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface ProductAvailabilityToggleProps {
	id?: string;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	className?: string;
	title?: string;
	activeDescription?: string;
	inactiveDescription?: string;
}

export const ProductAvailabilityToggle = ({
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
