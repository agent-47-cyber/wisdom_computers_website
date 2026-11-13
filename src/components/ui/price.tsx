"use client";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";

/** Rupee price that ticks digit-by-digit when it changes (NumberFlow). */
export function Price({ value, className, ask = "Ask for price" }: { value: number | null; className?: string; ask?: string }) {
  if (value == null) return <span className={cn("tabular", className)}>{ask}</span>;
  return (
    <NumberFlow
      value={value}
      locales="en-IN"
      format={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }}
      className={cn("tabular", className)}
    />
  );
}

export function Count({ value, className }: { value: number; className?: string }) {
  return <NumberFlow value={value} className={cn("tabular", className)} />;
}
