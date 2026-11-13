// Adapted from Magic UI (MIT) — magicui.design/docs/components/marquee
import { cn } from "@/lib/utils";

export function Marquee({
  className, reverse = false, pauseOnHover = false, repeat = 4, children, ...props
}: React.ComponentPropsWithoutRef<"div"> & { reverse?: boolean; pauseOnHover?: boolean; repeat?: number }) {
  return (
    <div {...props} className={cn("group flex gap-(--gap) overflow-hidden [--duration:40s] [--gap:2rem]", className)}>
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            "flex shrink-0 justify-around gap-(--gap) motion-safe:animate-[marquee_var(--duration)_linear_infinite]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
