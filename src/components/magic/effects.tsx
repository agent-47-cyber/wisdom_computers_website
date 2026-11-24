"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Magic UI–inspired pointer-tracking spotlight card.
 * GPU-only radial highlight on hover-capable devices; static on touch & reduced-motion.
 */
export function MagicCard({
  children,
  className,
  glow = "rgba(255, 122, 26, 0.14)",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -300, y: -300, on: false });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos((p) => ({ ...p, on: false }))}
      className={cn(
        "relative overflow-hidden",
        dark ? "ring-1 ring-inset ring-white/10" : "ring-1 ring-inset ring-ink/[0.05]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden transition-opacity duration-300 [@media(hover:hover)]:block"
        style={{
          opacity: pos.on ? 1 : 0,
          background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, ${glow}, transparent 70%)`,
        }}
      />
      <div className="relative z-10 flex h-full w-full flex-col">{children}</div>
    </div>
  );
}

/**
 * Magic UI–inspired BorderBeam: a crisp animated light highlight tracing a rounded container.
 * Uses pure CSS conic-gradient mask so it costs zero JS frames and pauses on reduced-motion.
 */
export function BorderBeam({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "border-beam pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
    />
  );
}

/** Subtle architectural workbench dot-grid backdrop. */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 dot-grid", className)}
    />
  );
}

/** Smooth blur-vertical word rotator for hero focus labels. */
export function WordRotate({
  words,
  interval = 2800,
  className,
}: {
  words: readonly string[];
  interval?: number;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval, reduce]);

  return (
    <span className={cn("inline-flex overflow-hidden align-bottom", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[idx]}
          initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="inline-block"
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
