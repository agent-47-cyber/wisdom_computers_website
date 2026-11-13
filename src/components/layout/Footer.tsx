import Link from "next/link";
import { SITE, waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ArrowChip, buttonVariants } from "@/components/ui/button";
import { InstallButton } from "@/components/pwa/InstallPrompt";
import { Logo } from "@/components/layout/Header";

export default function Footer() {
  return (
    <footer className="wrap pb-6 pt-10">
      {/* CTA band (Onetech newsletter strip → WhatsApp) */}
      <div className="relative overflow-hidden rounded-[32px] bg-ink p-8 text-white md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-[34px] leading-[1.05] tracking-tight md:text-[48px]">
            Price, stock or next batch? <span className="text-brand">Ask on WhatsApp.</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <a href={waLink(`Hi ${SITE.name}, I have a question.`)} target="_blank" rel="noopener" className={buttonVariants({ variant: "brand", size: "lg" }) + " pr-2"}>
              <WhatsAppIcon className="h-5 w-5" /> Chat now <ArrowChip className="ml-1" />
            </a>
            <InstallButton appName="Wisdom Computers" label="Add to phone" size="lg" className="border-white/15 bg-white/5 text-white hover:bg-white/10" />
          </div>
        </div>
      </div>

      <div className="grid gap-10 px-2 pb-8 pt-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">{SITE.tagline}: refurbished and new computers, repairs, printing and computer classes in Pratap Nagar, Jaipur.</p>
        </div>
        <div>
          <p className="mb-4 text-[13px] font-medium">Shop</p>
          <ul className="space-y-2.5 text-[14px] text-muted">
            <li><Link className="hover:text-ink" href="/products/?c=laptop">Laptops</Link></li>
            <li><Link className="hover:text-ink" href="/products/?c=desktop">Desktops and custom PCs</Link></li>
            <li><Link className="hover:text-ink" href="/products/?c=monitor">Monitors</Link></li>
            <li><Link className="hover:text-ink" href="/products/?c=other">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[13px] font-medium">Services</p>
          <ul className="space-y-2.5 text-[14px] text-muted">
            <li><Link className="hover:text-ink" href="/courses/">Computer courses</Link></li>
            <li><Link className="hover:text-ink" href="/#services">Repairs</Link></li>
            <li><Link className="hover:text-ink" href="/#services">Printing and online forms</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[13px] font-medium">Visit</p>
          <address className="space-y-1 text-[14px] not-italic text-muted">
            <p>{SITE.street}</p>
            <p>{SITE.area}</p>
            <p className="pt-2">{SITE.hours}</p>
            <p>Call <a className="text-ink hover:underline" href={SITE.phoneHref}>{SITE.phone}</a></p>
            <p>WhatsApp <a className="text-ink hover:underline" href={waLink(`Hi ${SITE.name}, I have a question.`)} target="_blank" rel="noopener">{SITE.whatsappDisplay}</a></p>
          </address>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-line px-2 pt-5 text-[13px] text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {SITE.name}, {SITE.city}</p>
        <Link href="/admin/" className="hover:text-ink">Staff login</Link>
      </div>
    </footer>
  );
}
