"use client";
import { Heart, Trash2 } from "lucide-react";
import { useCatalog, useQuickView, useSaved, useSavedSheet } from "@/lib/store";
import { rupees, SITE, waLink } from "@/lib/site";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ProductArt } from "@/components/shop/ProductArt";
import { cn } from "@/lib/utils";

/** Saved items, with one WhatsApp message that asks about all of them at once. */
export default function SavedSheet() {
  const { open, setOpen } = useSavedSheet();
  const { ids, toggle, clear } = useSaved();
  const products = useCatalog((s) => s.products);
  const openProduct = useQuickView((s) => s.open);
  const items = ids.map((id) => products?.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const available = items.filter((p) => p.in_stock);

  const message =
    `Hi ${SITE.name}, I'm interested in these:\n` +
    available.map((p, i) => `${i + 1}. ${p.name}${p.price != null ? ` (${rupees(p.price)})` : ""} [ID ${p.id.slice(0, 8)}]`).join("\n") +
    `\nAre they available?`;

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen} title="Saved items" className="md:w-[520px]">
      <div className="p-5 md:p-6">
        <div className="flex items-baseline justify-between pr-12">
          <h2 className="text-[26px] leading-tight">Saved</h2>
          {items.length > 0 && <button onClick={clear} className="text-[13px] text-muted hover:text-ink">Clear all</button>}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-surface"><Heart className="h-6 w-6 text-muted" strokeWidth={1.6} /></span>
            <p className="mt-4 text-[17px]">Nothing saved yet</p>
            <p className="mt-1 max-w-xs text-[14px] text-muted">Tap the heart on any product to compare later or ask about several at once.</p>
          </div>
        ) : (
          <>
            <ul className="mt-5 space-y-2">
              {items.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-surface p-2 pr-3">
                  <button onClick={() => { setOpen(false); setTimeout(() => openProduct(p.id), 150); }} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <ProductArt src={p.images[0]} category={p.category} className="h-16 w-16 shrink-0 rounded-xl" iconClassName="h-8 w-8" />
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-medium">{p.name}</span>
                      <span className={cn("block text-[13px]", p.in_stock ? "text-muted" : "text-sale")}>
                        {p.in_stock ? rupees(p.price) ?? "Ask for price" : "Sold"}
                      </span>
                    </span>
                  </button>
                  <button onClick={() => toggle(p.id)} aria-label={`Remove ${p.name}`} className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-white hover:text-ink">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            {available.length > 0 ? (
              <a href={waLink(message)} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "mt-5 w-full")}>
                <WhatsAppIcon /> Ask about {available.length === 1 ? "this item" : `all ${available.length}`} on WhatsApp
              </a>
            ) : (
              <p className="mt-5 text-center text-[14px] text-muted">Everything saved has sold. Ask us what’s similar.</p>
            )}
          </>
        )}
      </div>
    </ResponsiveModal>
  );
}
