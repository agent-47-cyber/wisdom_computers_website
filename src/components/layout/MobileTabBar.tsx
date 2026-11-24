"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Heart, Home, LayoutGrid } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { useSaved, useSavedSheet } from "@/lib/store";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/** Phone-only bottom bar (Stylo): Home · Shop · WhatsApp · Saved · Courses. */
export default function MobileTabBar() {
  const path = usePathname();
  const count = useSaved((s) => s.ids.length);
  const openSaved = useSavedSheet((s) => s.setOpen);

  const tab = "flex flex-1 flex-col items-center justify-center gap-1 text-[11px] transition-[color] duration-150";
  const active = (href: string) => (href === "/" ? path === "/" : path?.startsWith(href));

  return (
    <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(10px,env(safe-area-inset-bottom))] lg:hidden">
      <div className="relative mx-auto flex h-[66px] max-w-md items-stretch rounded-[26px] bg-white/90 px-1 shadow-[var(--shadow-pop)] backdrop-blur-xl">
        <Link href="/" aria-current={active("/") ? "page" : undefined} className={cn(tab, active("/") ? "text-ink" : "text-muted")}>
          <Home className="h-[22px] w-[22px]" strokeWidth={active("/") ? 2.2 : 1.7} />Home
        </Link>
        <Link href="/products/" aria-current={active("/products") ? "page" : undefined} className={cn(tab, active("/products") ? "text-ink" : "text-muted")}>
          <LayoutGrid className="h-[22px] w-[22px]" strokeWidth={active("/products") ? 2.2 : 1.7} />Shop
        </Link>
        <div className="flex flex-1 items-start justify-center">
          <a href={waLink(`Hi ${SITE.name}, I have a question.`)} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
            className="-mt-6 grid h-16 w-16 place-items-center rounded-full bg-wa text-white shadow-[0_12px_24px_-8px_rgb(26_158_85/.55)] ring-[6px] ring-bg transition-[scale,background-color] hover:bg-wa-strong active:scale-[0.92]">
            <WhatsAppIcon className="h-7 w-7 text-white" />
          </a>
        </div>
        <button onClick={() => openSaved(true)} className={cn(tab, "relative text-muted")} aria-label={`Saved items (${count})`}>
          <span className="relative">
            <Heart className="h-[22px] w-[22px]" strokeWidth={1.7} fill={count ? "var(--color-sale)" : "none"} color={count ? "var(--color-sale)" : "currentColor"} />
            {count > 0 && <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">{count}</span>}
          </span>
          Saved
        </button>
        <Link href="/courses/" aria-current={active("/courses") ? "page" : undefined} className={cn(tab, active("/courses") ? "text-ink" : "text-muted")}>
          <GraduationCap className="h-[22px] w-[22px]" strokeWidth={active("/courses") ? 2.2 : 1.7} />Courses
        </Link>
      </div>
    </nav>
  );
}
