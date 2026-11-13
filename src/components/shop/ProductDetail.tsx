"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import type { Product } from "@/lib/data";
import { categoryLabel, CONDITIONS, productMessage, SITE, waLink } from "@/lib/site";
import { Price } from "@/components/ui/price";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ProductArt } from "@/components/shop/ProductArt";
import HeartButton from "@/components/shop/HeartButton";
import { cn } from "@/lib/utils";

/**
 * Product details: gallery, condition scale, specs, buy bar.
 * "split" = side by side in the modal / phone sheet; "stack" = the shop page's side panel.
 */
export default function ProductDetail({ p, layout = "split" }: { p: Product; layout?: "split" | "stack" }) {
  const [img, setImg] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setImg(0); setCopied(false); }, [p.id]);

  async function share() {
    const url = `${window.location.origin}/products/?p=${p.id}`;
    try {
      if (navigator.share) await navigator.share({ title: p.name, text: `${p.name} at ${SITE.name}`, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); toast.success("Link copied"); }
    } catch { /* share sheet dismissed */ }
  }

  const specs = p.specs?.split(/·|,|\n/).map((s) => s.trim()).filter(Boolean) ?? [];
  const n = p.images.length;
  const split = layout === "split";

  return (
    <div className={cn(split && "grid md:grid-cols-[1.1fr_1fr] md:gap-2")}>
      <div>
        <div className="relative">
          <ProductArt src={p.images[img]} category={p.category} alt={p.name} priority className={cn("rounded-[24px]", split ? "aspect-square" : "aspect-[4/3]")} />
          <HeartButton id={p.id} name={p.name} className="absolute right-3 top-3" />
          {n > 1 && (
            <>
              <button onClick={() => setImg((img - 1 + n) % n)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-[var(--shadow-card)]"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setImg((img + 1) % n)} aria-label="Next photo" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-[var(--shadow-card)]"><ChevronRight className="h-5 w-5" /></button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/75 px-2.5 py-1 text-[12px] text-white tabular">{img + 1} / {n}</span>
            </>
          )}
        </div>
        {n > 1 && (
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto p-1">
            {p.images.map((u, i) => (
              <button key={u} onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`} aria-pressed={i === img}
                className={cn("h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-card transition-[box-shadow]", i === img ? "ring-brand" : "ring-transparent")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={cn("flex flex-col", split ? "px-3 pb-2 pt-5 md:p-6" : "px-2 pb-2 pt-4")}>
        <div className={cn("flex flex-wrap gap-1.5", split && "pr-12")}>
          <Badge>{categoryLabel(p.category)}</Badge>
          {p.in_stock ? <Badge tone="success">In stock</Badge> : <Badge tone="dark">Sold</Badge>}
        </div>
        <h2 className={cn("mt-3 leading-[1.1] tracking-tight", split ? "text-[28px] md:text-[32px]" : "text-[22px]")}>{p.name}</h2>
        <Price value={p.price} className={cn("mt-2 font-semibold tracking-tight text-accent", split ? "text-[32px]" : "text-[26px]")} />
        {p.price != null && <p className="text-[13px] text-muted">Listed price. Final price agreed on WhatsApp.</p>}

        {p.condition && (
          <div className="mt-5">
            <p className="text-[13px] font-medium">Condition</p>
            <div className="mt-2 flex gap-1.5" role="list">
              {CONDITIONS.map((c) => (
                <span key={c} role="listitem" aria-current={c === p.condition ? "true" : undefined}
                  className={cn("rounded-full border px-3 py-1.5 text-[13px]", c === p.condition ? "border-ink bg-ink text-white" : "border-line text-muted")}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {specs.length > 0 && (
          <div className="mt-5">
            <p className="text-[13px] font-medium">Specs</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {specs.map((s) => <li key={s} className="rounded-xl bg-surface px-3 py-2 text-[13.5px]">{s}</li>)}
            </ul>
          </div>
        )}

        <div className={cn("mt-auto pt-6", split && "sticky bottom-0 -mx-3 bg-gradient-to-t from-card via-card to-card/0 px-3 pb-1 md:static md:mx-0 md:bg-none md:px-0")}>
          <div className="flex gap-2">
            {p.in_stock ? (
              <a href={waLink(productMessage(p))} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "flex-1")}>
                <WhatsAppIcon /> Buy on WhatsApp
              </a>
            ) : (
              <a href={waLink(`Hi ${SITE.name}, is anything like ${p.name} coming back in stock?`)} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1")}>
                Ask about restock
              </a>
            )}
            <button onClick={share} className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-13 w-13")} aria-label="Share this product">
              {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" strokeWidth={1.8} />}
            </button>
          </div>
          <p className="mt-2 text-center text-[12.5px] text-muted">Opens WhatsApp with this item already named · or call {SITE.phone}</p>
        </div>
      </div>
    </div>
  );
}
