"use client";
import { categoryLabel, productMessage, waLink } from "@/lib/site";
import type { Product } from "@/lib/data";
import { useQuickView } from "@/lib/store";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductArt } from "@/components/shop/ProductArt";
import HeartButton from "@/components/shop/HeartButton";
import { cn } from "@/lib/utils";

export default function ProductCard({ p, selected = false }: { p: Product; selected?: boolean }) {
  const open = useQuickView((s) => s.open);
  return (
    <article aria-current={selected ? "true" : undefined}
      className={cn("card card-hover group relative flex flex-col p-2", !p.in_stock && "opacity-65", selected && "ring-2 ring-brand")}>
      {/* the whole card opens the product sheet; buttons sit above this layer */}
      <button onClick={() => open(p.id)} className="absolute inset-0 z-0 rounded-[28px]" aria-label={`View ${p.name}`} />

      <div className="pointer-events-none relative">
        <ProductArt src={p.images[0]} category={p.category} className="aspect-square rounded-[22px] [&_img]:group-hover:scale-[1.04]" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {p.in_stock ? p.condition && <Badge className="bg-white/90 backdrop-blur">{p.condition}</Badge> : <Badge tone="dark">Sold</Badge>}
        </div>
      </div>
      <HeartButton id={p.id} name={p.name} className="absolute right-4 top-4 z-10" />

      <div className="pointer-events-none relative flex flex-1 flex-col px-3 pb-3 pt-4">
        <p className="text-[12.5px] text-muted">{categoryLabel(p.category)}</p>
        <h3 className="mt-0.5 line-clamp-2 text-[16px] leading-snug tracking-tight">{p.name}</h3>
        {p.specs && <p className="mt-1 line-clamp-1 text-[13px] text-muted">{p.specs}</p>}
        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Price value={p.price} className={cn("font-semibold tracking-tight", p.price == null ? "text-[14px] font-medium text-muted" : "text-[17px] sm:text-[19px]")} />
          {p.in_stock ? (
            <a href={waLink(productMessage(p))} target="_blank" rel="noopener" aria-label={`Buy ${p.name} on WhatsApp`}
              className={cn(buttonVariants({ variant: "whatsapp", size: "sm" }), "pointer-events-auto relative z-10 h-10 w-full px-3.5 sm:w-auto")}>
              <WhatsAppIcon className="h-4 w-4" /> Buy
            </a>
          ) : (
            <span className="text-[12.5px] text-muted">Ask about restock</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-2" aria-hidden="true">
      <div className="aspect-square animate-pulse rounded-[22px] bg-surface" />
      <div className="space-y-2 px-3 pb-4 pt-4">
        <div className="h-3 w-16 animate-pulse rounded bg-surface" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
        <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-surface" />
      </div>
    </div>
  );
}
