import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", {
  variants: {
    tone: {
      neutral: "bg-surface text-ink/80",
      success: "bg-wa-soft text-wa-ink",
      dark: "bg-ink text-white",
      accent: "bg-accent-soft text-accent-strong",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export function Badge({
  className, tone, ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
