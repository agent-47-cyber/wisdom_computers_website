import { CategoryIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The product's cover photo on a soft "stage". Without a photo yet, shows the
 * category drawn large so the tile still reads as a product, never an empty box.
 */
export function ProductArt({
  src, category, alt = "", className, iconClassName, priority = false, contain = false,
}: {
  src?: string | null; category: string; alt?: string; className?: string; iconClassName?: string; priority?: boolean; contain?: boolean;
}) {
  return (
    <div className={cn("stage relative overflow-hidden", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async"
          className={cn("img-outline h-full w-full transition-[scale] duration-500 ease-out", contain ? "object-contain p-[8%]" : "object-cover")} />
      ) : (
        <div className="grid h-full w-full place-items-center">
          <CategoryIcon category={category} strokeWidth={1.1}
            className={cn("h-1/2 max-h-40 w-1/2 max-w-40 text-ink/80 drop-shadow-[0_18px_18px_rgb(18_18_18/.12)]", iconClassName)} />
        </div>
      )}
    </div>
  );
}
