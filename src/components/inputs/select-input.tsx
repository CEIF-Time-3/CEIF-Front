"use client";

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

export interface SelectInputProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	options: (SelectOption | string)[];
	placeholder?: string;
	label?: string;
	id?: string;
	disabled?: boolean;
	className?: string;
	triggerClassName?: string;
	size?: "sm" | "default";
	side?: "top" | "bottom" | "left" | "right";
	align?: "start" | "center" | "end";
}

export const SelectInput = ({
	value,
	defaultValue,
	onValueChange,
	options,
	placeholder = "Selecione uma opção",
	label,
	id,
	disabled = false,
	className,
	triggerClassName,
	size = "default",
	side = "bottom",
	align = "start",
}: SelectInputProps) => {
	const normalizedOptions: SelectOption[] = options.map((opt) =>
		typeof opt === "string" ? { label: opt, value: opt } : opt,
	);

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			{label && (
				<label htmlFor={id} className="text-foreground text-xs font-semibold">
					{label}
				</label>
			)}
			<Select
				value={value}
				defaultValue={defaultValue}
				onValueChange={(val) => {
					if (val && onValueChange) {
						onValueChange(val);
					}
				}}
				disabled={disabled}
			>
				<SelectTrigger
					id={id}
					size={size}
					className={cn("bg-background text-xs", triggerClassName)}
				>
					<SelectValue placeholder={placeholder} />
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
		</div>
	);
};
