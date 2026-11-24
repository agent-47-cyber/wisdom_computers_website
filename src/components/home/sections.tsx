"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { BadgeIndianRupee, Clock, Cpu, MapPin, MessageCircle, Phone, Printer, Store, Wrench } from "lucide-react";
import { useCatalog } from "@/lib/store";
import { BRANDS, brandOf, CATEGORIES, openNow, productMessage, SERVICES, SITE, waLink } from "@/lib/site";
import ProductCard, { ProductCardSkeleton } from "@/components/shop/ProductCard";
import { ProductArt } from "@/components/shop/ProductArt";
import { CategoryIcon, WhatsAppIcon } from "@/components/ui/icons";
import { ArrowChip, buttonVariants } from "@/components/ui/button";
import { Count } from "@/components/ui/price";
import { Marquee } from "@/components/magic/marquee";
import { MagicCard } from "@/components/magic/effects";
import { cn } from "@/lib/utils";

/* ─── shared ─────────────────────────────────────────────────────────────── */

export function SectionHead({ title, sub, action, className }: { title: string; sub?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        <h2 className="text-[28px] leading-[1.08] md:text-[40px]">{title}</h2>
        {sub && <p className="mt-2 text-[15px] leading-relaxed text-muted md:text-[16px]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function OpenStatus({ className }: { className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => { setOpen(openNow()); const t = setInterval(() => setOpen(openNow()), 60000); return () => clearInterval(t); }, []);
  if (open == null) return <span className={className}>&nbsp;</span>;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("h-2 w-2 rounded-full", open ? "live-dot bg-wa" : "bg-muted")} aria-hidden="true" />
      {open ? "Open now · closes 9 pm" : "Closed · opens 8 am, Mon–Sat"}
    </span>
  );
}

/* ─── value strip (Onetech) ──────────────────────────────────────────────── */

const VALUES = [
  { I: Store, t: "Classes & typing center", d: "RS-CIT, Tally, Excel, C/C++, Typing" },
  { I: BadgeIndianRupee, t: "UPI, Card & NFC", d: "Google Pay, debit card & cash" },
  { I: Wrench, t: "In-store & onsite repair", d: "Laptops, desktops & installation" },
  { I: Printer, t: "Printing, toner & forms", d: "Color/B&W print, online forms" },
  { I: Clock, t: "Open 8 am – 9 pm", d: "Monday to Saturday" },
];

export function ValueStrip() {
  return (
    <section className="wrap pt-3">
      <ul className="card no-scrollbar flex snap-x gap-2 overflow-x-auto p-2 md:grid md:grid-cols-5 md:overflow-visible">
        {VALUES.map(({ I, t, d }) => (
          <li key={t} className="flex min-w-[220px] snap-start items-center gap-3 rounded-[22px] p-3 md:min-w-0">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"><I className="h-5 w-5" strokeWidth={1.8} /></span>
            <span><span className="block text-[14px] font-medium leading-tight">{t}</span><span className="block text-[12.5px] text-muted">{d}</span></span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─── categories (Onetech grid / Stylo chips on phone) ───────────────────── */

export function CategoryGrid() {
  const { products } = useCatalog();
  const totalInStock = (products ?? []).filter((p) => p.in_stock).length;
  return (
    <section className="wrap pt-20">
      <SectionHead title="Shop by category" action={<Link href="/products/" className="text-[14px] font-medium underline-offset-4 hover:underline">See all</Link>} />
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6">
        {CATEGORIES.map((c) => {
          const n = (products ?? []).filter((p) => p.in_stock && p.category === c.id).length;
          return (
            <Link key={c.id} href={`/products/?c=${c.id}`} className="group w-[140px] shrink-0 snap-start md:w-auto">
              <MagicCard className="card card-hover flex h-full flex-col items-center p-3 text-center">
                <span className="stage grid aspect-square w-full place-items-center rounded-[22px]">
                  <CategoryIcon category={c.id} strokeWidth={1.25} className="h-12 w-12 text-ink transition-[scale,color] duration-300 group-hover:scale-110 group-hover:text-accent" />
                </span>
                <span className="mt-3 text-[14.5px] font-medium leading-tight">{c.label}</span>
                <span className="mb-1 text-[12.5px] text-muted">
                  {products ? (totalInStock > 0 ? <><Count value={n} /> in stock</> : "Check availability") : " "}
                </span>
              </MagicCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─── featured stock with quick tabs ─────────────────────────────────────── */

const TABS = [
  { id: "new", label: "Newest" },
  { id: "laptop", label: "Laptops" },
  { id: "budget", label: "Under ₹10,000" },
  { id: "acc", label: "Accessories" },
] as const;

export function FeaturedProducts() {
  const { products, error } = useCatalog();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("new");
  const list = useMemo(() => {
    const s = (products ?? []).filter((p) => p.in_stock);
    const byNew = (a: { created_at?: string }, b: { created_at?: string }) => (b.created_at ?? "").localeCompare(a.created_at ?? "");
    const r = tab === "laptop" ? s.filter((p) => p.category === "laptop")
      : tab === "budget" ? s.filter((p) => p.price != null && p.price < 10000)
      : tab === "acc" ? s.filter((p) => ["keyboard", "mouse", "other"].includes(p.category))
      : s;
    return [...r].sort(byNew).slice(0, 8);
  }, [products, tab]);

  return (
    <section className="wrap pt-20">
      <SectionHead title="Fresh on the shelf" sub="Tap any item for photos and specs. Buy opens WhatsApp with the item already named."
        action={<Link href="/products/" className={cn(buttonVariants({ variant: "outline" }), "hidden pr-1.5 sm:inline-flex")}>All stock <ArrowChip className="h-8 w-8" /></Link>} />
      <LayoutGroup id="featured-tabs">
        <div className="no-scrollbar -mx-4 mb-5 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Filter stock">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={cn("relative h-10 shrink-0 rounded-full px-4 text-[14px] transition-[color]", tab === t.id ? "text-white" : "bg-card text-ink/75 shadow-[var(--shadow-card)] hover:text-ink")}>
              {tab === t.id && <motion.span layoutId="feat-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0, duration: 0.35 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      {error && <p className="text-muted">Stock could not load. Ask us on WhatsApp.</p>}
      {!products && !error && <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[0, 1, 2, 3].map((k) => <ProductCardSkeleton key={k} />)}</div>}
      {products && list.length > 0 && <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      {products && list.length === 0 && (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <p className="text-[22px] tracking-tight">Tell us what you need</p>
          <p className="mt-2 max-w-md text-[15px] text-muted">Share the laptop, PC or accessory and your budget. We’ll reply with what’s on the shelf.</p>
          <a href={waLink(`Hi ${SITE.name}, I'm looking for: `)} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "whatsapp" }), "mt-6")}>
            <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
          </a>
        </div>
      )}
    </section>
  );
}

/* ─── promo banners (Onetech) ────────────────────────────────────────────── */

export function PromoBanners() {
  const { products } = useCatalog();
  const laptop = products?.find((p) => p.in_stock && p.category === "laptop" && p.images[0]);
  const desktop = products?.find((p) => p.in_stock && p.category === "desktop" && p.images[0]);
  const custom = SERVICES.find((s) => s.id === "custom")!;

  const banner = "group relative flex min-h-[240px] overflow-hidden rounded-[32px] p-7 md:min-h-[300px] md:p-9";
  return (
    <section className="wrap grid gap-3 pt-20 md:grid-cols-2">
      <Link href="/products/?c=laptop" className={cn(banner, "bg-ink text-white")}>
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 flex max-w-[60%] flex-col">
          <p className="text-[13px] text-white/60">Refurbished</p>
          <p className="mt-2 text-[28px] leading-[1.08] tracking-tight md:text-[36px]">A refurbished laptop at a <span className="text-brand">fair price</span></p>
          <span className={cn(buttonVariants({ variant: "brand" }), "mt-auto w-fit pr-1.5")}>Shop laptops <ArrowChip className="h-8 w-8" /></span>
        </div>
        <ProductArt src={laptop?.images[0]} category="laptop" contain
          className="absolute -right-6 bottom-0 aspect-square w-[55%] !bg-none transition-[translate] duration-500 group-hover:-translate-y-2" iconClassName="h-3/4 w-3/4 max-h-none max-w-none text-white/85 drop-shadow-[0_24px_30px_rgb(255_122_26/.25)]" />
      </Link>
      <a href={waLink(custom.ask)} target="_blank" rel="noopener" className={cn(banner, "bg-brand text-ink")}>
        <div className="relative z-10 flex max-w-[60%] flex-col">
          <p className="text-[13px] text-ink/60">Built at the shop</p>
          <p className="mt-2 text-[28px] leading-[1.08] tracking-tight md:text-[36px]">A custom PC for your budget and your work</p>
          <span className={cn(buttonVariants({ variant: "primary" }), "mt-auto w-fit pr-1.5")}>Plan it on WhatsApp <ArrowChip light className="h-8 w-8" /></span>
        </div>
        <ProductArt src={desktop?.images[0]} category="desktop" contain
          className="absolute -right-4 bottom-0 aspect-square w-[50%] !bg-none transition-[translate] duration-500 group-hover:-translate-y-2" iconClassName="h-3/4 w-3/4 max-h-none max-w-none text-ink/85" />
      </a>
    </section>
  );
}

/* ─── services ───────────────────────────────────────────────────────────── */

const SERVICE_ICONS = { repair: Wrench, custom: Cpu, jobwork: Printer } as const;

export function Services() {
  return (
    <section id="services" className="wrap scroll-mt-24 pt-20">
      <SectionHead title="Repairs and job work" sub="Bring it to the counter, or describe the problem on WhatsApp first." />
      <div className="grid gap-3 md:grid-cols-3">
        {SERVICES.map((s) => {
          const I = SERVICE_ICONS[s.id];
          return (
            <a key={s.id} href={waLink(s.ask)} target="_blank" rel="noopener" className="block h-full">
              <MagicCard className="card card-hover relative flex h-full flex-col p-6">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent"><I className="h-5 w-5" strokeWidth={1.8} /></span>
                <ArrowChip className="absolute right-5 top-5" />
                <h3 className="mt-8 text-[21px] leading-tight">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-medium text-wa-ink"><WhatsAppIcon className="h-4 w-4" /> Describe it on WhatsApp</span>
              </MagicCard>
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* ─── brands in stock (only brands actually found in product names) ──────── */

export function BrandStrip() {
  const { products } = useCatalog();
  const found = useMemo(() => {
    const inStock = new Set((products ?? []).filter((p) => p.in_stock).map((p) => brandOf(p.name)));
    return BRANDS.filter((b) => inStock.has(b));
  }, [products]);
  if (found.length < 3) return null;
  return (
    <section className="pt-20" aria-label={`Brands in stock: ${found.join(", ")}`}>
      <p className="wrap mb-4 text-[13px] text-muted">Brands on the shelf right now</p>
      <div className="[mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Marquee pauseOnHover className="[--duration:35s] [--gap:3.5rem]">
          {found.map((b) => <span key={b} aria-hidden="true" className="text-[30px] font-semibold tracking-tight text-ink/35 md:text-[38px]">{b}</span>)}
        </Marquee>
      </div>
    </section>
  );
}

/* ─── how buying works (WhatsApp light theme) ────────────────────────────── */

export function HowItWorks() {
  const { products } = useCatalog();
  const p = products?.find((x) => x.in_stock && x.featured) ?? products?.find((x) => x.in_stock);
  const msg = p ? productMessage(p) : `Hi ${SITE.name}, I'm interested in: Dell Latitude 7490 (listed at ₹18,500). Is it available?`;
  const steps = [
    ["Tap Buy on WhatsApp", "The chat opens with the item, its listed price and ID already typed."],
    ["Ask anything, agree the price", "More photos, battery health, another spec: settle it in the chat."],
    ["Collect from the counter", `Check it in person at ${SITE.street} before you pay.`],
  ];
  return (
    <section className="wrap pt-20">
      <div className="card grid items-center gap-10 overflow-hidden p-6 md:p-10 lg:grid-cols-[1fr_auto]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-wa-soft px-3 py-1.5 text-[12.5px] text-wa-ink"><MessageCircle className="h-3.5 w-3.5" /> How buying works</span>
          <h2 className="mt-4 text-[30px] leading-[1.06] md:text-[44px]">No cart, no checkout. Just a chat with the shop.</h2>
          <ol className="mt-8 grid gap-3 md:grid-cols-3">
            {steps.map(([t, d], k) => (
              <li key={t} className="rounded-[22px] bg-surface p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-[13px] font-medium text-white">{k + 1}</span>
                <p className="mt-4 text-[16px] font-medium leading-snug">{t}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mx-auto w-full max-w-[320px] rounded-[40px] bg-ink p-2.5 shadow-[var(--shadow-pop)]">
          <div className="overflow-hidden rounded-[32px] bg-[#efeae2]">
            <div className="flex items-center gap-3 bg-[#008069] px-4 py-3 text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/icon-192.png" alt="" className="h-9 w-9 rounded-full" />
              <div><p className="text-[14px] font-medium">{SITE.name}</p><p className="text-[11px] text-white/75">Business account</p></div>
            </div>
            <div className="min-h-[250px] space-y-2 p-3 pb-6">
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.4 }}
                className="ml-auto max-w-[88%] origin-bottom-right rounded-xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-[13.5px] leading-snug text-[#111]">
                {msg}
                <span className="mt-1 block text-right text-[10.5px] text-[#667781]">Sent from the website ✓✓</span>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 }}
                className="flex w-16 items-center gap-1 rounded-xl rounded-tl-sm bg-white px-3 py-3 shadow-sm" aria-label="The shop is typing">
                {[0, 1, 2].map((k) => (
                  <motion.span key={k} className="h-1.5 w-1.5 rounded-full bg-[#8696a0]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: k * 0.18 }} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── visit ──────────────────────────────────────────────────────────────── */

export function Visit() {
  return (
    <section id="visit" className="wrap scroll-mt-24 pt-20">
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="card card-hover relative flex min-h-[280px] flex-col overflow-hidden p-7">
          {/* stylised street grid: decorative, the button opens real Google Maps */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full text-ink/[0.06]" aria-hidden="true">
            <defs><pattern id="streets" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M0 32h64M32 0v64" stroke="currentColor" strokeWidth="10" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#streets)" />
          </svg>
          <span className="absolute right-[22%] top-[38%] grid h-14 w-14 place-items-center rounded-full bg-ink text-brand shadow-[var(--shadow-lift)]" aria-hidden="true"><MapPin className="h-6 w-6" /></span>
          <p className="relative text-[13px] text-muted">Visit the shop</p>
          <h2 className="relative mt-2 max-w-sm text-[34px] leading-[1.04] md:text-[44px]">{SITE.street}, Pratap Nagar</h2>
          <p className="relative mt-2 text-[15px] text-muted">{SITE.area}</p>
          <span className={cn(buttonVariants({ variant: "brand" }), "relative mt-auto w-fit pr-1.5")}>Get directions <ArrowChip className="h-8 w-8" /></span>
        </a>
        <div className="grid gap-3">
          <div className="card flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent"><Clock className="h-5 w-5" /></span>
            <div><p className="text-[16px] font-medium">{SITE.hours}</p><OpenStatus className="text-[13px] text-muted" /></div>
          </div>
          <a href={SITE.phoneHref} className="card card-hover flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent"><Phone className="h-5 w-5" /></span>
            <div><p className="text-[16px] font-medium">{SITE.phone}</p><p className="text-[13px] text-muted">Call the shop</p></div>
          </a>
          <a href={waLink(`Hi ${SITE.name}, I have a question.`)} target="_blank" rel="noopener" className="card card-hover flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-wa-soft text-wa"><WhatsAppIcon className="h-5 w-5" /></span>
            <div><p className="text-[16px] font-medium">{SITE.whatsappDisplay}</p><p className="text-[13px] text-muted">WhatsApp for prices, stock and batches</p></div>
          </a>
        </div>
      </div>
    </section>
  );
}

