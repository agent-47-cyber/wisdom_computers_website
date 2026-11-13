"use client";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useSaved, useSavedSheet } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Save / unsave a product. Filled when saved; a toast offers a shortcut to the list. */
export default function HeartButton({ id, name, className }: { id: string; name: string; className?: string }) {
  const saved = useSaved((s) => s.ids.includes(id));
  const toggle = useSaved((s) => s.toggle);
  const openSheet = useSavedSheet((s) => s.setOpen);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={(e) => {
        e.stopPropagation();
        toggle(id);
        if (!saved) toast(`Saved ${name}`, { action: { label: "View saved", onClick: () => openSheet(true) } });
      }}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-[var(--shadow-card)] backdrop-blur transition-[scale,color] duration-150 active:scale-[0.9]",
        saved ? "text-sale" : "text-ink/70 hover:text-ink",
        className
      )}
    >
      <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
