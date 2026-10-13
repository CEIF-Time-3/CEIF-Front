"use client";

import type { MaskitoOptions } from "@maskito/core";
import { useMaskito } from "@maskito/react";
import React from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FieldInputProps extends React.ComponentProps<typeof Input> {
  label?: React.ReactNode;
  labelRight?: React.ReactNode;
  description?: React.ReactNode;
  error?: string | Array<{ message?: string } | undefined>;
  required?: boolean;
  orientation?: "vertical" | "horizontal" | "responsive";
  containerClassName?: string;
  startAddon?: React.ReactNode;
  maskOptions?: MaskitoOptions;
  maskitoOptions?: MaskitoOptions;
}

export const FieldInput = ({
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
    [maskitoRef, ref, activeMaskOptions]
  );

  const inputElement = (
    <Input
      id={inputId}
      ref={combinedRef}
      aria-invalid={isInvalid}
      className={cn(
        "h-8.5 text-xs transition-all",
        isInvalid && "border-destructive focus-visible:ring-destructive/20",
        className
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
      {(label || labelRight) && (
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
          {labelRight}
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
