import { cn } from "@/lib/utils";

/**
 * The Wisdom Computers mark: a "W" drawn as one continuous signal line with a cursor pixel
 * (together they also read as "wi"). Source files and exports live in /brand.
 */
export function LogoMark({ className, variant = "default" }: { className?: string; variant?: "default" | "staff" | "mono" }) {
  const c = {
    default: { bg: "#121212", line: "#ff7a1a", px: "#ffffff" },
    staff: { bg: "#ff7a1a", line: "#121212", px: "#121212" },
    mono: { bg: "none", line: "currentColor", px: "currentColor" },
  }[variant];
  return (
    <svg viewBox="0 0 64 64" className={cn("h-9 w-9 shrink-0", className)} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill={c.bg} />
      <polyline points="14,22 23,45 32,29 41,45 50,22" fill="none" stroke={c.line} strokeWidth="6.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="45.5" y="11" width="6.5" height="6.5" rx="1.6" fill={c.px} />
    </svg>
  );
}

/** Mark + "wisdom / COMPUTERS" lockup in live text (crisp, selectable, uses Geist). */
export function LogoLockup({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[19px] font-semibold tracking-[-0.03em]">wisdom</span>
          <span className="mt-[3px] text-[8.5px] font-semibold tracking-[0.2em] text-muted">COMPUTERS</span>
        </span>
      )}
    </span>
  );
}
