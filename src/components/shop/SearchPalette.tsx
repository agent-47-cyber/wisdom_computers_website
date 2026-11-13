"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Dialog } from "@base-ui/react/dialog";
import { Search, GraduationCap, Wrench, MapPin, Phone, ArrowRight } from "lucide-react";
import { useCatalog, useQuickView, useSearch } from "@/lib/store";
import { categoryLabel, rupees, SITE, waLink } from "@/lib/site";
import { CategoryIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Every typed word must appear in the item (no fuzzy letter-skipping: "tally" must not match "Logitech"). */
function wordMatch(value: string, search: string) {
  const v = value.toLowerCase();
  return search.toLowerCase().split(/\s+/).filter(Boolean).every((w) => v.includes(w)) ? 1 : 0;
}

/** ⌘K / Ctrl+K: search stock, courses and shop actions from anywhere. */
export default function SearchPalette() {
  const { open, setOpen } = useSearch();
  const { products, courses } = useCatalog();
  const openProduct = useQuickView((s) => s.open);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(!useSearch.getState().open); }
      if (e.key === "/" && !(e.target as HTMLElement)?.closest("input,textarea,[contenteditable]")) { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const run = (fn: () => void) => { setOpen(false); setTimeout(fn, 60); };
  const item = "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] outline-none";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-[10vh] z-50 w-[min(640px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[22px] bg-card shadow-[var(--shadow-pop)] outline-none transition-[opacity,scale] duration-150 ease-out data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0">
          <Dialog.Title className="sr-only">Search Wisdom Computers</Dialog.Title>
          <Command label="Search" loop filter={wordMatch}>
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-5 w-5 text-muted" strokeWidth={1.75} aria-hidden="true" />
              <Command.Input autoFocus placeholder="Search laptops, keyboards, Tally, RS-CIT…" className="h-14 flex-1 bg-transparent text-[16px] outline-none focus-visible:outline-none placeholder:text-muted/70" />
              <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted sm:block">esc</kbd>
            </div>
            <Command.List className="overlay-scroll max-h-[60vh] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-8 text-center text-[15px] text-muted">
                Not listed yet. <a className="text-wa-ink underline" href={waLink(`Hi ${SITE.name}, do you have `)} target="_blank" rel="noopener">Ask on WhatsApp</a>
              </Command.Empty>

              {!!products?.length && (
                <Command.Group heading="In stock">
                  {products.filter((p) => p.in_stock).map((p) => (
                    <Command.Item key={p.id} value={`${p.name} ${p.specs ?? ""} ${categoryLabel(p.category)}`} onSelect={() => run(() => openProduct(p.id))} className={item}>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-accent"><CategoryIcon category={p.category} className="h-4.5 w-4.5" /></span>
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      <span className="tabular text-[14px] text-muted">{rupees(p.price) ?? "Ask"}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {!!courses?.length && (
                <Command.Group heading="Courses">
                  {courses.map((c) => (
                    <Command.Item key={c.id} value={`course ${c.name} ${c.exam_for ?? ""}`} onSelect={() => run(() => router.push(`/courses/#${c.id}`))} className={item}>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-accent"><GraduationCap className="h-4.5 w-4.5" strokeWidth={1.5} /></span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <ArrowRight className="h-4 w-4 text-muted" />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              <Command.Group heading="Shop">
                <Command.Item value="whatsapp chat message" onSelect={() => run(() => window.open(waLink(`Hi ${SITE.name}, I have a question.`), "_blank"))} className={item}>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-wa-soft text-wa-ink"><WhatsAppIcon className="h-4.5 w-4.5" /></span>Chat on WhatsApp
                </Command.Item>
                <Command.Item value="call phone" onSelect={() => run(() => (window.location.href = SITE.phoneHref))} className={item}>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-accent"><Phone className="h-4.5 w-4.5" strokeWidth={1.5} /></span>Call {SITE.phone}
                </Command.Item>
                <Command.Item value="repair service printing toner forms custom pc" onSelect={() => run(() => router.push("/#services"))} className={item}>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-accent"><Wrench className="h-4.5 w-4.5" strokeWidth={1.5} /></span>Repairs, custom PCs and job work
                </Command.Item>
                <Command.Item value="directions address map location visit" onSelect={() => run(() => window.open(SITE.mapsUrl, "_blank"))} className={item}>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-accent"><MapPin className="h-4.5 w-4.5" strokeWidth={1.5} /></span>Directions to the shop
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
