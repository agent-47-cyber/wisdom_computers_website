"use client";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct, setInStock, type Product } from "@/lib/data";
import { categoryLabel, rupees } from "@/lib/site";
import { CategoryIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { AdminBar, StickyActions, friendlyError } from "@/components/admin/AdminBar";
import ProductWizard from "@/components/admin/ProductWizard";
import type { Role } from "@/components/admin/types";
import { cn } from "@/lib/utils";

type Props = { role: Role; items: Product[]; refresh: () => Promise<void>; onBack: () => void; startAdd?: boolean };

export default function ProductManager({ role, items, refresh, onBack, startAdd }: Props) {
  const [editing, setEditing] = useState<Product | "new" | null>(startAdd ? "new" : null);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"stock" | "sold">("stock");

  const shown = useMemo(() => items.filter((p) =>
    (tab === "stock" ? p.in_stock : !p.in_stock) && (!q || p.name.toLowerCase().includes(q.toLowerCase()))
  ), [items, q, tab]);

  async function toggle(p: Product) {
    try {
      await setInStock(p.id, !p.in_stock);
      await refresh();
      toast.success(p.in_stock ? `${p.name} marked sold` : `${p.name} back in stock`, {
        action: { label: "Undo", onClick: async () => { await setInStock(p.id, p.in_stock); refresh(); } },
      });
    } catch (e) { toast.error(friendlyError(e)); }
  }

  if (editing) {
    return (
      <ProductWizard
        product={editing === "new" ? null : editing}
        canDelete={role === "admin"}
        onDelete={async (p) => { try { await deleteProduct(p.id); await refresh(); toast.success("Deleted"); setEditing(null); } catch (e) { toast.error(friendlyError(e)); } }}
        onDone={async () => { await refresh(); }}
        onClose={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="pb-28">
      <AdminBar title="Products" onBack={onBack} />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" strokeWidth={1.75} aria-hidden="true" />
        <label htmlFor="pq" className="sr-only">Find a product</label>
        <input id="pq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a product"
          className="h-13 w-full rounded-2xl border border-line bg-card pl-12 pr-4 text-[16px] outline-none focus:border-accent" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-surface p-1" role="tablist">
        {(["stock", "sold"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={cn("h-11 rounded-xl text-[15px] transition-[background-color,box-shadow]", tab === t ? "bg-card font-medium shadow-[var(--shadow-card)]" : "text-muted")}>
            {t === "stock" ? `In stock (${items.filter((p) => p.in_stock).length})` : `Sold (${items.filter((p) => !p.in_stock).length})`}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {shown.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-card p-2 pr-3 shadow-[var(--shadow-card)]">
            <button onClick={() => setEditing(p)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={`Edit ${p.name}`}>
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface text-accent">
                {p.images[0]
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                  : <CategoryIcon category={p.category} className="h-6 w-6" />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[16px] font-medium">{p.name}</span>
                <span className="block text-[14px] text-muted">{categoryLabel(p.category)} · {rupees(p.price) ?? "Ask price"}</span>
              </span>
            </button>
            <button onClick={() => toggle(p)} aria-label={p.in_stock ? `Mark ${p.name} sold` : `Put ${p.name} back in stock`}
              className={cn("h-11 shrink-0 rounded-full px-4 text-[14px] font-medium transition-[background-color,scale] active:scale-[0.96]",
                p.in_stock ? "bg-wa-soft text-wa-ink" : "bg-ink text-white")}>
              {p.in_stock ? "In stock" : "Sold"}
            </button>
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <p className="mt-10 text-center text-[16px] text-muted">{q ? "Nothing matches." : tab === "stock" ? "Nothing in stock yet. Tap Add product." : "Nothing sold yet."}</p>
      )}

      <StickyActions>
        <Button size="xl" className="w-full" onClick={() => setEditing("new")}>
          <Plus className="h-6 w-6" /> Add product
        </Button>
      </StickyActions>
    </div>
  );
}
