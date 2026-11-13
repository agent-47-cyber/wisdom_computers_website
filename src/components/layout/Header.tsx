"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Phone, Search } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { useSaved, useSavedSheet, useSearch } from "@/lib/store";
import { WhatsAppIcon } from "@/components/ui/icons";
import { LogoLockup } from "@/components/ui/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/products/", label: "Shop" },
  { href: "/courses/", label: "Courses" },
  { href: "/#services", label: "Repairs" },
  { href: "/#visit", label: "Visit" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="shrink-0" aria-label={`${SITE.name} home`}>
      <LogoLockup compact={compact} />
    </Link>
  );
}

const iconBtn = "relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-card shadow-[var(--shadow-card)] transition-[scale,background-color] active:scale-[0.94] hover:bg-surface";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const setSearch = useSearch((s) => s.setOpen);
  const savedCount = useSaved((s) => s.ids.length);
  const openSaved = useSavedSheet((s) => s.setOpen);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="sticky top-0 z-40 pt-3">
      <a href="#main" className="skip">Skip to content</a>
      <div className="wrap">
        <div className={cn("flex h-16 items-center gap-3 rounded-full border border-white/60 px-2.5 pl-4 transition-[background-color,box-shadow] duration-300",
          scrolled ? "bg-white/75 shadow-[var(--shadow-lift)] backdrop-blur-xl backdrop-saturate-150" : "bg-white/55 backdrop-blur-md")}>
          <Logo />

          {/* Nitec-style pill search: opens the command palette */}
          <button onClick={() => setSearch(true)}
            className="ml-2 hidden h-11 min-w-0 flex-1 items-center gap-3 rounded-full bg-card pl-5 pr-1.5 text-left text-[15px] text-muted shadow-[var(--shadow-card)] transition-[box-shadow] hover:shadow-[var(--shadow-lift)] md:flex lg:max-w-md">
            <span className="flex-1 truncate">Search laptops, PCs, Tally, RS-CIT…</span>
            <kbd className="hidden rounded-md bg-surface px-1.5 py-0.5 font-mono text-[11px] lg:block">Ctrl K</kbd>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white"><Search className="h-4 w-4" strokeWidth={2} /></span>
          </button>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={path === n.href ? "page" : undefined}
                className="rounded-full px-3.5 py-2 text-[15px] text-ink/70 transition-[color,background-color] duration-150 hover:bg-white hover:text-ink aria-[current=page]:bg-white aria-[current=page]:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-1">
            <button onClick={() => setSearch(true)} aria-label="Search" className={cn(iconBtn, "md:hidden")}><Search className="h-[18px] w-[18px]" strokeWidth={1.9} /></button>
            <a href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`} className={cn(iconBtn, "lg:hidden")}><Phone className="h-[18px] w-[18px]" strokeWidth={1.9} /></a>
            <button onClick={() => openSaved(true)} aria-label={`Saved items (${savedCount})`} className={iconBtn}>
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.9} fill={savedCount ? "var(--color-sale)" : "none"} color={savedCount ? "var(--color-sale)" : "currentColor"} />
              {savedCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-semibold text-white tabular">{savedCount}</span>}
            </button>
            <a href={waLink(`Hi ${SITE.name}, I have a question.`)} target="_blank" rel="noopener"
              className={cn(buttonVariants({ variant: "whatsapp" }), "hidden h-11 pl-4 pr-5 lg:inline-flex")}>
              <WhatsAppIcon className="h-[18px] w-[18px]" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
