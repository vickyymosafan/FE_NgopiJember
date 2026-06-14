"use client";

import * as React from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

export function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger",
      )}
    >
      {message}
    </div>
  );
}