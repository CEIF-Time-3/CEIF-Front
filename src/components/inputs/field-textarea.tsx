"use client";

import React from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface FieldTextareaProps extends React.ComponentProps<
  typeof Textarea
> {
  label?: React.ReactNode;
  labelRight?: React.ReactNode;
  description?: React.ReactNode;
  error?: string | Array<{ message?: string } | undefined>;
  required?: boolean;
  orientation?: "vertical" | "horizontal" | "responsive";
  containerClassName?: string;
}

export const FieldTextarea = ({
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
              htmlFor={textareaId}
              className="text-foreground flex items-center gap-1 text-xs font-semibold"
            >
              {label}
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          {labelRight}
        </div>
      )}
      <Textarea
        id={textareaId}
        aria-invalid={isInvalid}
        className={cn(
          "resize-none text-xs transition-all",
          isInvalid && "border-destructive focus-visible:ring-destructive/20",
          className
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
