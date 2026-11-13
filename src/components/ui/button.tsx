import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium " +
    "transition-[scale,background-color,box-shadow,color,border-color] duration-150 ease-out " +
    "enabled:active:scale-[0.96] [&:is(a)]:active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-ink/85",
        brand: "bg-brand text-ink hover:bg-brand-strong",
        whatsapp: "bg-wa text-white hover:bg-wa-strong",
        outline: "border border-line bg-card text-ink hover:border-ink/20 hover:bg-surface",
        ghost: "text-ink hover:bg-surface",
        danger: "bg-red-700 text-white hover:bg-red-800",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[15px]",
        lg: "h-13 px-6 text-base",
        xl: "h-16 px-7 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant, size, ...props },
  ref
) {
  return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

/** Round black arrow chip (Nitec): sits at the end of pill CTAs and in card corners. */
export function ArrowChip({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span aria-hidden="true" className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", light ? "bg-white text-ink" : "bg-ink text-white", className)}>
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11 11 5M6 5h5v5" />
      </svg>
    </span>
  );
}
