"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCatalog, useQuickView } from "@/lib/store";
import { useMedia } from "@/lib/useMedia";
import { brandOf, BRANDS, CATEGORIES, CONDITIONS, PRICE_BANDS, SITE, waLink } from "@/lib/site";
import ProductCard, { ProductCardSkeleton } from "@/components/shop/ProductCard";
import ProductDetail from "@/components/shop/ProductDetail";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { CategoryIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Count } from "@/components/ui/price";
import { cn } from "@/lib/utils";

const SORTS = [
  { id: "new", label: "Newest" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
] as const;

type PriceId = (typeof PRICE_BANDS)[number]["id"];
const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/** Shop page: filter sidebar · product grid · detail panel (wide screens). Filters open as a sheet on phones. */
export default function ProductBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const { products, error } = useCatalog();
  const { id: selectedId, setInline } = useQuickView();
  const wide = useMedia("(min-width: 1280px)");

  const [cat, setCat] = useState(params.get("c") ?? "all");
  const [price, setPrice] = useState<PriceId>("any");
  const [conds, setConds] = useState<string[]>(params.get("cond") ? [params.get("cond")!] : []);
  const [brands, setBrands] = useState<string[]>([]);
  const [showSold, setShowSold] = useState(false);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("new");
  const [sheet, setSheet] = useState(false);

  // wide screens show the selected product in the side panel instead of a modal
  useEffect(() => { setInline(wide); return () => setInline(false); }, [wide, setInline]);
  useEffect(() => {
    const c = params.get("c"); if (c) setCat(c);
    const cond = params.get("cond"); if (cond) setConds([cond]);
  }, [params]);

  function pickCat(id: string) {
    setCat(id);
    const u = new URL(window.location.href);
    if (id === "all") u.searchParams.delete("c"); else u.searchParams.set("c", id);
    u.searchParams.delete("cond");
    router.replace(u.pathname + u.search, { scroll: false });
  }
  function reset() { setPrice("any"); setConds([]); setBrands([]); setShowSold(false); setQ(""); pickCat("all"); }

  const pool = useMemo(() => (products ?? []).filter((p) => showSold || p.in_stock), [products, showSold]);
  const brandsInStock = useMemo(() => BRANDS.filter((b) => pool.some((p) => brandOf(p.name) === b)), [pool]);

  const list = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === price)!;
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const r = pool.filter((p) =>
      (cat === "all" || p.category === cat) &&
      (price === "any" || (p.price != null && p.price >= band.min && p.price < band.max)) &&
      (conds.length === 0 || (p.condition != null && conds.includes(p.condition))) &&
      (brands.length === 0 || brands.includes(brandOf(p.name) ?? "")) &&
      words.every((w) => `${p.name} ${p.specs ?? ""}`.toLowerCase().includes(w))
    );
    const val = (n: number | null, hi: boolean) => n ?? (hi ? -1 : Infinity);
    if (sort === "low") r.sort((a, b) => val(a.price, false) - val(b.price, false));
    if (sort === "high") r.sort((a, b) => val(b.price, true) - val(a.price, true));
    if (sort === "new") r.sort((a, b) => Number(b.in_stock) - Number(a.in_stock) || (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    return r;
  }, [pool, cat, price, conds, brands, q, sort]);

  const active = (price !== "any" ? 1 : 0) + conds.length + brands.length + (showSold ? 1 : 0);
  const selected = wide ? (products?.find((p) => p.id === selectedId) ?? list[0] ?? null) : null;

  const group = "border-t border-line pt-5 mt-5 first:mt-0 first:border-0 first:pt-0";
  const legend = "mb-3 text-[14px] font-semibold";
  const row = "flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-2 text-[14.5px] transition-[background-color] hover:bg-surface";
  const box = "h-[18px] w-[18px] shrink-0 accent-[var(--color-brand)]";

  const filters = (
    <div>
      <fieldset className={group}>
        <legend className={legend}>Category</legend>
        {[{ id: "all", label: "All products" }, ...CATEGORIES].map((c) => {
          const n = c.id === "all" ? pool.length : pool.filter((p) => p.category === c.id).length;
          const on = cat === c.id;
          return (
            <button key={c.id} type="button" onClick={() => pickCat(c.id)} aria-pressed={on}
              className={cn(row, "w-full text-left", on && "bg-accent-soft font-medium text-accent-strong hover:bg-accent-soft")}>
              <CategoryIcon category={c.id === "all" ? "other" : c.id} className="h-[18px] w-[18px]" />
              <span className="flex-1">{c.label}</span>
              <span className="text-[13px] text-muted tabular">{n}</span>
            </button>
          );
        })}
      </fieldset>

      <fieldset className={group}>
        <legend className={legend}>Price</legend>
        {PRICE_BANDS.map((b) => (
          <label key={b.id} className={row}>
            <input type="radio" name="price" className={box} checked={price === b.id} onChange={() => setPrice(b.id)} /> {b.label}
          </label>
        ))}
      </fieldset>

      <fieldset className={group}>
        <legend className={legend}>Condition</legend>
        {CONDITIONS.map((c) => (
          <label key={c} className={row}>
            <input type="checkbox" className={box} checked={conds.includes(c)} onChange={() => setConds(toggleIn(conds, c))} /> {c}
          </label>
        ))}
      </fieldset>

      {brandsInStock.length > 0 && (
        <fieldset className={group}>
          <legend className={legend}>Brand</legend>
          <div className="grid grid-cols-2">
            {brandsInStock.map((b) => (
              <label key={b} className={row}>
                <input type="checkbox" className={box} checked={brands.includes(b)} onChange={() => setBrands(toggleIn(brands, b))} /> {b}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className={group}>
        <label className={row}>
          <input type="checkbox" className={box} checked={showSold} onChange={(e) => setShowSold(e.target.checked)} /> Show sold items
        </label>
      </fieldset>
    </div>
  );

  return (
    <div className="mt-8 grid items-start gap-3 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_360px]">
      {/* sidebar */}
      <aside className="card sticky top-[96px] hidden max-h-[calc(100svh-112px)] overflow-y-auto p-4 lg:block" aria-label="Filters">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[16px] font-semibold">Filter by</p>
          <button onClick={reset} className="text-[13px] text-accent hover:underline">Reset all</button>
        </div>
        {filters}
      </aside>

      {/* results */}
      <div className="min-w-0">
        <div className="card flex flex-wrap items-center gap-2 p-2.5">
          <div className="relative min-w-0 basis-full sm:flex-1 sm:basis-auto">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} aria-hidden="true" />
            <label htmlFor="q" className="sr-only">Search stock</label>
            <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by model, processor, RAM…"
              className="h-11 w-full rounded-full bg-surface pl-11 pr-10 text-[15px] outline-none transition-[box-shadow] focus:ring-2 focus:ring-brand" />
            {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-white"><X className="h-4 w-4" /></button>}
          </div>
          <Button variant="outline" className="lg:hidden" onClick={() => setSheet(true)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {active > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-semibold tabular">{active}</span>}
          </Button>
          <label htmlFor="sort" className="sr-only">Sort</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-card px-4 text-[14px] outline-none focus:border-ink sm:flex-none">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>

        {/* category chips on phones (sidebar is hidden there) */}
        <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 lg:hidden" role="group" aria-label="Category">
          {[{ id: "all", label: "All" }, ...CATEGORIES].map((c) => (
            <button key={c.id} onClick={() => pickCat(c.id)} aria-pressed={cat === c.id}
              className={cn("h-10 shrink-0 rounded-full px-4 text-[14px] transition-[background-color,color]", cat === c.id ? "bg-ink text-white" : "bg-card text-ink/75 shadow-[var(--shadow-card)]")}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 px-1">
          <h2 className="text-[20px] tracking-tight">Available now</h2>
          <p className="text-[14px] text-muted" aria-live="polite">{products ? <><Count value={list.length} /> {list.length === 1 ? "item" : "items"}</> : "Loading…"}</p>
          <div className="flex flex-wrap gap-1.5 sm:ml-auto">
            {price !== "any" && <Chip onClear={() => setPrice("any")}>{PRICE_BANDS.find((b) => b.id === price)!.label}</Chip>}
            {conds.map((c) => <Chip key={c} onClear={() => setConds(toggleIn(conds, c))}>{c}</Chip>)}
            {brands.map((b) => <Chip key={b} onClear={() => setBrands(toggleIn(brands, b))}>{b}</Chip>)}
          </div>
        </div>

        {error && <p className="mt-6 text-muted">Stock could not load. Ask us on WhatsApp.</p>}

        <motion.div layout className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {!products && !error && Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((p) => (
              <motion.div key={p.id} layout
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
                <ProductCard p={p} selected={selected?.id === p.id} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {products && list.length === 0 && (
          <div className="card mt-3 flex flex-col items-center px-6 py-14 text-center">
            <p className="text-[22px] tracking-tight">Nothing matches these filters</p>
            <p className="mt-2 max-w-sm text-[15px] text-muted">Stock changes every day. Clear the filters, or tell us what you need and we’ll check.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={reset}>Clear filters</Button>
              <a href={waLink(`Hi ${SITE.name}, I'm looking for ${q || (cat === "all" ? "a laptop" : CATEGORIES.find((c) => c.id === cat)?.label.toLowerCase())}. Do you have one?`)} target="_blank" rel="noopener" className={buttonVariants({ variant: "whatsapp" })}>
                <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      {/* detail panel (wide screens) */}
      {wide && (
        <aside className="card sticky top-[96px] max-h-[calc(100svh-112px)] overflow-y-auto p-2" aria-label="Product details">
          {selected ? <ProductDetail p={selected} layout="stack" /> : <p className="p-6 text-[15px] text-muted">Pick a product to see its details here.</p>}
        </aside>
      )}

      {/* filters sheet (phones and tablets) */}
      <ResponsiveModal open={sheet} onOpenChange={setSheet} title="Filters" className="md:w-[420px]">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between pr-12">
            <p className="text-[20px] font-semibold">Filter by</p>
            <button onClick={reset} className="text-[13px] text-accent hover:underline">Reset all</button>
          </div>
          {filters}
          <Button variant="brand" size="lg" className="sticky bottom-0 mt-5 w-full" onClick={() => setSheet(false)}>
            Show {list.length} {list.length === 1 ? "item" : "items"}
          </Button>
        </div>
      </ResponsiveModal>
    </div>
  );
}

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <button onClick={onClear} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent-soft px-3 text-[13px] text-accent-strong">
      {children} <X className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">Remove filter</span>
    </button>
  );
}
