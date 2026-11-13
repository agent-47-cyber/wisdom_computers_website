"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, GraduationCap, MapPin, Package, Phone, Star, Wrench } from "lucide-react";
import { useCatalog, useQuickView } from "@/lib/store";
import { categoryLabel, CONDITIONS, SITE, waLink } from "@/lib/site";
import type { Product } from "@/lib/data";
import { ArrowChip, buttonVariants } from "@/components/ui/button";
import { Count, Price } from "@/components/ui/price";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ProductArt } from "@/components/shop/ProductArt";
import { OpenStatus } from "@/components/home/sections";
import { cn } from "@/lib/utils";

const CONDITION_COLORS: Record<string, string> = { "Like New": "#22c55e", Good: "#3b82f6", Fair: "#f59e0b" };

/** Featured first, then newest in stock. */
function useSpotlight(products: Product[] | null) {
  return useMemo(() => {
    const inStock = (products ?? []).filter((p) => p.in_stock);
    const byNew = (a: Product, b: Product) => (b.created_at ?? "").localeCompare(a.created_at ?? "");
    return [...inStock.filter((p) => p.featured), ...inStock.filter((p) => !p.featured).sort(byNew)].slice(0, 6);
  }, [products]);
}

/** Annotation pinned to the hero product: label, value, a hairline and a dot. */
function Callout({ label, value, className, flip = false }: { label: string; value: React.ReactNode; className?: string; flip?: boolean }) {
  return (
    <div className={cn("absolute hidden items-center gap-2 md:flex", flip && "flex-row-reverse text-right", className)}>
      <div className="max-w-[9.5rem]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink/60">{label}</p>
        <p className="truncate text-[14px] font-semibold">{value}</p>
      </div>
      <span className="h-px w-10 bg-ink/50" aria-hidden="true" />
      <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" />
    </div>
  );
}

function StatTile({ href, external, icon, label, children, sub }: { href: string; external?: boolean; icon: React.ReactNode; label: string; children: React.ReactNode; sub: string }) {
  const body = (
    <>
      <span className="flex items-center gap-2 text-[13px] text-muted"><span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent">{icon}</span><span className="hidden sm:inline">{label}</span></span>
      <span className="mt-3 block text-[26px] font-semibold leading-[1.1] tracking-tight sm:text-[32px]">{children}</span>
      <span className="block text-[12.5px] text-muted">{sub}</span>
    </>
  );
  const cls = "card card-hover flex flex-col justify-center p-4 sm:p-5";
  return external ? <a href={href} target="_blank" rel="noopener" className={cls}>{body}</a> : <Link href={href} className={cls}>{body}</Link>;
}

export default function HeroBento() {
  const { products, courses } = useCatalog();
  const openProduct = useQuickView((s) => s.open);
  const spotlight = useSpotlight(products);
  const inStock = (products ?? []).filter((p) => p.in_stock);
  const newest = [...inStock].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))[0];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = spotlight.length;
  const cur = n ? spotlight[i % n] : null;
  const firstSpec = cur?.specs?.split(/·|,/)[0]?.trim();

  useEffect(() => {
    if (n < 2 || paused || reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n, paused, reduce]);

  return (
    <section className="wrap pt-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* banner */}
        <div className="rise relative grid min-h-[460px] overflow-hidden rounded-[32px] bg-brand p-6 md:grid-cols-[1.05fr_1fr] md:p-10"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <p aria-hidden="true" className="pointer-events-none absolute -bottom-[0.18em] left-0 select-none whitespace-nowrap text-[clamp(7rem,21vw,19rem)] font-bold uppercase leading-none tracking-[-0.06em] text-ink/[0.07]">Wisdom</p>

          <div className="relative z-10 flex flex-col">
            <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-ink/70">Refurbished · New · Repairs · Classes</p>
            <h1 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-[-0.045em]">
              Your computer shop in Pratap Nagar.
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/75">
              Laptops, desktops and accessories on the shelf today. Pick one here, settle the price on WhatsApp, collect at the counter.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <Link href="/products/" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "pr-2")}>Shop now <ArrowChip light className="ml-1" /></Link>
              <Link href="/courses/" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "hover:bg-ink/10")}>See courses</Link>
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-10 text-[13px] text-ink/75">
              <a href={SITE.mapsUrl} target="_blank" rel="noopener" aria-label="Directions on Google Maps" className="grid h-9 w-9 place-items-center rounded-full bg-ink/10 text-ink hover:bg-ink/20"><MapPin className="h-4 w-4" /></a>
              <a href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`} className="grid h-9 w-9 place-items-center rounded-full bg-ink/10 text-ink hover:bg-ink/20"><Phone className="h-4 w-4" /></a>
              <a href={waLink(`Hi ${SITE.name}, I have a question.`)} target="_blank" rel="noopener" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full bg-ink/10 text-ink hover:bg-ink/20"><WhatsAppIcon className="h-4 w-4" /></a>
              <OpenStatus className="ml-2" />
            </div>
          </div>

          {/* product with callouts */}
          <div className="relative z-10 mt-8 min-h-[300px] md:mt-0" aria-live="polite">
            <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25" aria-hidden="true" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.button key={cur?.id ?? "none"} onClick={() => cur && openProduct(cur.id)} aria-label={cur ? `Open ${cur.name}` : "Products"}
                className="absolute inset-[9%] grid place-items-center"
                initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)", transition: { duration: 0.2 } }}
                transition={{ type: "spring", bounce: 0, duration: 0.7 }}>
                <ProductArt src={cur?.images[0]} category={cur?.category ?? "laptop"} alt={cur?.name ?? ""} contain priority
                  className="float aspect-square w-full max-w-[360px] rounded-full !bg-none" iconClassName="h-3/5 w-3/5 max-h-none max-w-none text-ink" />
              </motion.button>
            </AnimatePresence>
            {cur && (
              <>
                <Callout className="left-0 top-[8%]" label={categoryLabel(cur.category)} value={cur.name} />
                {firstSpec && <Callout flip className="right-0 top-[42%]" label="Spec" value={firstSpec} />}
                <Callout className="bottom-[16%] left-[2%]" label={cur.condition ?? "Price"} value={<Price value={cur.price} ask="Ask price" />} />
                <div className="absolute bottom-0 right-0 flex items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-2 text-[13px] font-semibold tabular md:hidden"><Price value={cur.price} ask="Ask price" /></span>
                  <span className="rounded-full bg-ink px-3 py-2 font-mono text-[12px] text-white tabular">{String((i % n) + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
                  {n > 1 && (
                    <div className="flex rounded-full bg-white">
                      <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous product" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface"><ChevronLeft className="h-4 w-4" /></button>
                      <button onClick={() => setI((i + 1) % n)} aria-label="Next product" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* live stats */}
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          <StatTile href="/products/" icon={<Package className="h-4 w-4" />} label="In stock now" sub="items on the shelf">
            {products ? <Count value={inStock.length} /> : "–"}
          </StatTile>
          <StatTile href={SITE.mapsUrl} external icon={<Star className="h-4 w-4" />} label="Google rating" sub={`${SITE.google.reviews} reviews`}>
            {SITE.google.rating}<span className="text-[16px] font-medium text-muted">/5</span>
          </StatTile>
          <StatTile href="/courses/" icon={<GraduationCap className="h-4 w-4" />} label="Computer classes" sub="courses running">
            <Count value={courses?.length ?? 8} />
          </StatTile>
        </div>
      </div>

      {/* second row */}
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-[16px] font-medium">Shop by condition</p>
          <div className="mt-4 flex gap-2">
            {CONDITIONS.map((c) => (
              <Link key={c} href={`/products/?cond=${encodeURIComponent(c)}`} className="group flex flex-1 flex-col items-center gap-2 rounded-2xl bg-surface px-2 py-3 text-center transition-[background-color] hover:bg-line">
                <span className="h-6 w-6 rounded-full ring-4 ring-white transition-[scale] group-hover:scale-110" style={{ background: CONDITION_COLORS[c] }} />
                <span className="text-[12.5px] leading-tight">{c}<br /><span className="text-muted">{products ? inStock.filter((p) => p.condition === c).length : "–"}</span></span>
              </Link>
            ))}
          </div>
        </div>

        <button onClick={() => newest && openProduct(newest.id)} disabled={!newest} className="card card-hover relative flex min-h-[150px] items-stretch overflow-hidden text-left disabled:cursor-default">
          <div className="flex flex-col p-5">
            <p className="text-[16px] font-medium">New on the shelf</p>
            <p className="mt-1 line-clamp-2 max-w-[11rem] text-[13px] text-muted">{newest?.name ?? "Fresh stock lands here first"}</p>
            <ArrowChip className="mt-auto" />
          </div>
          <ProductArt src={newest?.images[0]} category={newest?.category ?? "desktop"} className="m-2 ml-auto w-2/5 shrink-0 rounded-[22px]" />
        </button>

        <Link href="/#services" className="card card-hover relative flex flex-col bg-ink p-5 text-white">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px]"><Wrench className="h-3.5 w-3.5 text-brand" /> At the counter</span>
          <p className="mt-3 max-w-[15rem] text-[19px] leading-snug tracking-tight">Repairs, custom PCs, printing and online forms</p>
          <ArrowChip light className="absolute right-4 top-4" />
        </Link>
      </div>
    </section>
  );
}
