"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, GraduationCap, Laptop, MapPin, Package, Phone, Printer, Sparkles, Star, Wrench } from "lucide-react";
import { useCatalog, useQuickView } from "@/lib/store";
import { categoryLabel, CONDITIONS, SITE, waLink } from "@/lib/site";
import type { Product } from "@/lib/data";
import { ArrowChip, buttonVariants } from "@/components/ui/button";
import { Count, Price } from "@/components/ui/price";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ProductArt } from "@/components/shop/ProductArt";
import { OpenStatus } from "@/components/home/sections";
import { BorderBeam, DotGrid, MagicCard, WordRotate } from "@/components/magic/effects";
import { cn } from "@/lib/utils";

const CONDITION_COLORS: Record<string, string> = { "Like New": "#22c55e", Good: "#3b82f6", Fair: "#f59e0b" };

const HERO_WORDS = [
  "RS-CIT & Tally Classes",
  "Hindi & English Typing",
  "Laptop Sales & Repairs",
  "Printing & Online Forms",
] as const;

const PILLARS = [
  {
    id: "pillar-classes",
    badge: "Classes & Typing Center",
    title: "RS-CIT, Tally & Typing",
    spec: "RS-CIT · Tally with GST · Hindi & English Typing · Advanced Excel · MS Office · DCA · C/C++ · AutoCAD",
    tagLeft: "Batches",
    valLeft: "Regular & crash",
    tagRight: "Timings",
    valRight: "Morning to evening",
    icon: GraduationCap,
    ctaLabel: "Find your course",
    href: "/#workshop-tools",
    external: false,
  },
  {
    id: "pillar-sales-repair",
    badge: "Sales & Repair Desk",
    title: "Laptops, PCs & Repairs",
    spec: "New & refurbished laptops, desktops, accessories, plus in-store & onsite repairs",
    tagLeft: "Service",
    valLeft: "In-store & onsite",
    tagRight: "Payments",
    valRight: "UPI · Card · NFC",
    icon: Laptop,
    ctaLabel: "Ask today's stock",
    href: waLink(`Hi ${SITE.name}, what laptops/desktops are available today?`),
    external: true,
  },
  {
    id: "pillar-jobwork",
    badge: "Counter Job Work",
    title: "Printing, Toner & Forms",
    spec: "Color & B/W printouts, toner refilling, govt & exam online form filling, and typing work",
    tagLeft: "Walk-in",
    valLeft: "Kumbha Marg, Sec 8",
    tagRight: "Open",
    valRight: "Mon–Sat, 8 am–9 pm",
    icon: Printer,
    ctaLabel: "Ask at counter",
    href: waLink(`Hi ${SITE.name}, I need help with printing / toner refill / online form filling.`),
    external: true,
  },
] as const;

/** Featured first, then newest in stock. */
function useSpotlight(products: Product[] | null) {
  return useMemo(() => {
    const inStock = (products ?? []).filter((p) => p.in_stock);
    const byNew = (a: Product, b: Product) => (b.created_at ?? "").localeCompare(a.created_at ?? "");
    return [...inStock.filter((p) => p.featured), ...inStock.filter((p) => !p.featured).sort(byNew)].slice(0, 6);
  }, [products]);
}

function StatTile({
  href,
  external,
  icon,
  label,
  children,
  sub,
}: {
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  sub: string;
}) {
  const inner = (
    <MagicCard className="card card-hover h-full p-4 sm:p-5">
      <span className="flex items-center gap-2 text-[13px] text-muted">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent">{icon}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
      <span className="mt-3 block text-[24px] font-semibold leading-[1.1] tracking-tight sm:text-[32px]">{children}</span>
      <span className="mt-0.5 block text-[12.5px] text-muted">{sub}</span>
    </MagicCard>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener" className="block h-full">{inner}</a>
  ) : (
    <Link href={href} className="block h-full">{inner}</Link>
  );
}

export default function HeroBento() {
  const { products, courses } = useCatalog();
  const openProduct = useQuickView((s) => s.open);
  const spotlight = useSpotlight(products);
  const inStock = (products ?? []).filter((p) => p.in_stock);
  const newest = [...inStock].sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))[0];

  const hasProducts = spotlight.length > 0;
  const totalSlides = hasProducts ? spotlight.length : PILLARS.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (totalSlides < 2 || paused || reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % totalSlides), 5000);
    return () => clearInterval(t);
  }, [totalSlides, paused, reduce]);

  const curProduct = hasProducts ? spotlight[i % spotlight.length] : null;
  const curPillar = !hasProducts ? PILLARS[i % PILLARS.length] : null;
  const firstSpec = curProduct?.specs?.split(/·|,/)[0]?.trim();

  return (
    <section className="wrap pt-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_272px]">
        {/* Main Hero Banner */}
        <div
          className="rise relative grid min-h-[470px] items-stretch gap-6 overflow-hidden rounded-[32px] bg-brand p-6 shadow-[var(--shadow-lift)] md:grid-cols-[1.08fr_0.92fr] md:p-9"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <DotGrid className="text-ink/[0.12] [mask-image:radial-gradient(ellipse_at_25%_25%,black,transparent_75%)]" />
          <p
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[0.18em] left-0 select-none whitespace-nowrap text-[clamp(7rem,20vw,18rem)] font-bold uppercase leading-none tracking-[-0.06em] text-ink/[0.065]"
          >
            Wisdom
          </p>

          {/* Left copy */}
          <div className="relative z-10 flex flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-ink/10 px-3 py-1.5 text-[12px] font-medium text-ink backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <WordRotate words={HERO_WORDS} className="font-mono text-[11.5px] uppercase tracking-[0.08em]" />
            </div>

            <h1 className="mt-5 text-[clamp(2.45rem,4.7vw,4.25rem)] font-bold uppercase leading-[0.93] tracking-[-0.045em] text-ink">
              Computer classes, sales & repairs in Pratap Nagar.
            </h1>

            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-ink/80">
              RS-CIT, Tally with GST and typing center on Kumbha Marg — plus new & refurbished laptops, repairs, printing, toner refilling and online forms.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link href="/courses/" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "pr-2 shadow-sm")}>
                Explore courses <ArrowChip light className="ml-1" />
              </Link>
              <Link
                href="/products/"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-ink/15 bg-white/90 text-ink hover:bg-white")}
              >
                Browse stock
              </Link>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-8 text-[13px] font-medium text-ink/80">
              <a href={SITE.mapsUrl} target="_blank" rel="noopener" aria-label="Directions on Google Maps" className="grid h-9 w-9 place-items-center rounded-full bg-ink/10 text-ink transition-colors hover:bg-ink/20">
                <MapPin className="h-4 w-4" />
              </a>
              <a href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`} className="grid h-9 w-9 place-items-center rounded-full bg-ink/10 text-ink transition-colors hover:bg-ink/20">
                <Phone className="h-4 w-4" />
              </a>
              <a href={waLink(`Hi ${SITE.name}, I have a question.`)} target="_blank" rel="noopener" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full bg-ink/10 text-ink transition-colors hover:bg-ink/20">
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <OpenStatus className="ml-1 rounded-full bg-white/55 px-3 py-1.5 text-[12.5px] text-ink backdrop-blur-sm" />
            </div>
          </div>

          {/* Right: Obsidian Stage with BorderBeam */}
          <div className="relative z-10 flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[26px] bg-ink p-5 text-white shadow-[var(--shadow-pop)]">
            <BorderBeam />
            <DotGrid className="text-white/[0.08] [mask-image:radial-gradient(circle_at_50%_40%,black,transparent_78%)]" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-3xl"
            />

            {/* Top stage bar */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {curProduct ? categoryLabel(curProduct.category) : curPillar?.badge}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11.5px] text-white/80 tabular">
                {String((i % totalSlides) + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
              </span>
            </div>

            {/* Center visual */}
            <div className="relative z-10 my-3 flex flex-1 items-center justify-center" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                {curProduct ? (
                  <motion.button
                    key={curProduct.id}
                    onClick={() => openProduct(curProduct.id)}
                    aria-label={`Open ${curProduct.name}`}
                    className="group flex w-full flex-col items-center text-center"
                    initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)", transition: { duration: 0.18 } }}
                    transition={{ type: "spring", bounce: 0, duration: 0.55 }}
                  >
                    <ProductArt
                      src={curProduct.images[0]}
                      category={curProduct.category}
                      alt={curProduct.name}
                      contain
                      priority
                      className="float aspect-square w-44 rounded-2xl !bg-none sm:w-52"
                      iconClassName="h-3/4 w-3/4 max-h-none max-w-none text-white/90 drop-shadow-[0_16px_28px_rgba(255,122,26,0.3)]"
                    />
                    <p className="mt-2 line-clamp-1 text-[18px] font-semibold tracking-tight text-white">{curProduct.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-[13px] text-white/65">
                      {firstSpec ? `${firstSpec} · ` : ""}
                      <Price value={curProduct.price} ask="Ask price" className="font-semibold text-brand" />
                    </p>
                  </motion.button>
                ) : curPillar ? (
                  <motion.div
                    key={curPillar.id}
                    className="flex w-full flex-col items-center text-center"
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.18 } }}
                    transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                  >
                    <div className="float grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-brand/30 to-white/5 ring-1 ring-white/15 shadow-[0_20px_40px_-12px_rgba(255,122,26,0.4)]">
                      <curPillar.icon className="h-11 w-11 text-brand" strokeWidth={1.6} />
                    </div>
                    <h2 className="mt-4 text-[22px] font-semibold leading-tight tracking-tight text-white">{curPillar.title}</h2>
                    <p className="mt-1.5 max-w-xs text-[13.5px] leading-relaxed text-white/70">{curPillar.spec}</p>
                    <div className="mt-4 grid w-full grid-cols-2 gap-2 text-left">
                      <div className="rounded-xl bg-white/[0.06] px-3 py-2 ring-1 ring-white/10">
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">{curPillar.tagLeft}</p>
                        <p className="mt-0.5 truncate text-[12.5px] font-medium text-white">{curPillar.valLeft}</p>
                      </div>
                      <div className="rounded-xl bg-white/[0.06] px-3 py-2 ring-1 ring-white/10">
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/50">{curPillar.tagRight}</p>
                        <p className="mt-0.5 truncate text-[12.5px] font-medium text-brand">{curPillar.valRight}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Bottom controls */}
            <div className="relative z-10 flex items-center justify-between gap-2 pt-2">
              {curProduct ? (
                <button
                  onClick={() => openProduct(curProduct.id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand px-3.5 text-[13px] font-medium text-ink transition-transform active:scale-[0.96] hover:bg-brand-strong"
                >
                  View specs
                </button>
              ) : curPillar?.external ? (
                <a
                  href={curPillar.href}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-wa px-3.5 text-[13px] font-medium text-white transition-transform active:scale-[0.96] hover:bg-wa-strong"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" /> {curPillar.ctaLabel}
                </a>
              ) : curPillar ? (
                <Link
                  href={curPillar.href}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand px-3.5 text-[13px] font-medium text-ink transition-transform active:scale-[0.96] hover:bg-brand-strong"
                >
                  {curPillar.ctaLabel}
                </Link>
              ) : null}

              {totalSlides > 1 && (
                <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                  <button
                    onClick={() => setI((i - 1 + totalSlides) % totalSlides)}
                    aria-label="Previous highlight"
                    className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setI((i + 1) % totalSlides)}
                    aria-label="Next highlight"
                    className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:bg-white/15"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live stats column */}
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          <StatTile href="/courses/" icon={<GraduationCap className="h-4 w-4" />} label="Computer classes" sub="RS-CIT, Tally, Typing">
            <Count value={courses?.length ?? 8} />
          </StatTile>
          <StatTile href={SITE.mapsUrl} external icon={<Star className="h-4 w-4 fill-current" />} label="Google rating" sub={`${SITE.google.reviews} real reviews`}>
            {SITE.google.rating}
            <span className="text-[16px] font-medium text-muted">/5</span>
          </StatTile>
          <StatTile
            href="/products/"
            icon={<Package className="h-4 w-4" />}
            label="Shelf stock"
            sub={inStock.length > 0 ? "ready at the counter" : "new & refurbished"}
          >
            {products ? (inStock.length > 0 ? <Count value={inStock.length} /> : "Daily") : "–"}
          </StatTile>
        </div>
      </div>

      {/* Second Bento Row */}
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <MagicCard className="card p-5">
          <p className="text-[16px] font-medium">Shop by condition</p>
          <div className="mt-4 flex gap-2">
            {CONDITIONS.map((c) => {
              const count = inStock.filter((p) => p.condition === c).length;
              return (
                <Link
                  key={c}
                  href={`/products/?cond=${encodeURIComponent(c)}`}
                  className="group flex flex-1 flex-col items-center gap-2 rounded-2xl bg-surface px-2 py-3 text-center transition-[background-color,transform] hover:bg-line active:scale-[0.97]"
                >
                  <span className="h-5 w-5 rounded-full ring-4 ring-white transition-[scale] group-hover:scale-110" style={{ background: CONDITION_COLORS[c] }} />
                  <span className="text-[12.5px] font-medium leading-tight">
                    {c}
                    <br />
                    <span className="font-normal text-muted">{inStock.length > 0 ? count : "Browse"}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </MagicCard>

        {newest ? (
          <button onClick={() => openProduct(newest.id)} className="block h-full text-left">
            <MagicCard className="card card-hover relative flex h-full min-h-[150px] flex-row items-stretch overflow-hidden">
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[16px] font-medium">New on the shelf</p>
                <p className="mt-1 line-clamp-2 max-w-[11rem] text-[13px] text-muted">{newest.name}</p>
                <ArrowChip className="mt-auto" />
              </div>
              <ProductArt src={newest.images[0]} category={newest.category} className="m-2 ml-auto w-2/5 shrink-0 rounded-[22px]" />
            </MagicCard>
          </button>
        ) : (
          <a href={waLink(`Hi ${SITE.name}, what new or refurbished laptops are in stock today?`)} target="_blank" rel="noopener" className="block h-full">
            <MagicCard className="card card-hover relative flex h-full min-h-[150px] flex-col justify-between p-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-wa-soft px-2.5 py-1 text-[11.5px] font-medium text-wa-ink">
                  <WhatsAppIcon className="h-3.5 w-3.5" /> Direct counter desk
                </span>
                <p className="mt-3 text-[17px] font-medium leading-snug">Looking for a laptop, PC or accessory?</p>
                <p className="mt-1 text-[13px] text-muted">Share your budget — we’ll send photos of what’s on the shelf today.</p>
              </div>
              <ArrowChip className="absolute right-4 top-4" />
            </MagicCard>
          </a>
        )}

        <Link href="/#workshop-tools" className="block h-full">
          <MagicCard dark glow="rgba(255, 122, 26, 0.25)" className="card card-hover relative flex h-full min-h-[150px] flex-col bg-ink p-5 text-white">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px]">
              <Wrench className="h-3.5 w-3.5 text-brand" /> Quick desk
            </span>
            <p className="mt-3 max-w-[16rem] text-[19px] font-medium leading-snug tracking-tight">
              Course & batch finder, repairs, printing & online forms
            </p>
            <ArrowChip light className="absolute right-4 top-4" />
          </MagicCard>
        </Link>
      </div>
    </section>
  );
}
