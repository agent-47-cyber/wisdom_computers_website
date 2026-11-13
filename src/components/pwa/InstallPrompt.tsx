"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { toast } from "sonner";
import { useInstall } from "@/lib/pwa";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";

/** Steps shown on iPhone, where Safari has no one-tap install. */
export function IOSGuide({ open, onOpenChange, appName }: { open: boolean; onOpenChange: (v: boolean) => void; appName: string }) {
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title={`Add ${appName} to Home Screen`} className="md:w-[440px]">
      <div className="p-5 md:p-6">
        <h2 className="pr-10 text-[24px] leading-tight">Add {appName} to your Home Screen</h2>
        <ol className="mt-6 space-y-4 text-[15px]">
          <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-surface"><Share className="h-5 w-5" strokeWidth={1.75} /></span>Tap the Share button in Safari</li>
          <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-surface"><SquarePlus className="h-5 w-5" strokeWidth={1.75} /></span>Choose “Add to Home Screen”</li>
          <li className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-surface font-medium">✓</span>Tap “Add”. The icon appears on your phone.</li>
        </ol>
        <Button className="mt-6 w-full" onClick={() => onOpenChange(false)}>Got it</Button>
      </div>
    </ResponsiveModal>
  );
}

/** Button form — used in the footer and in the staff panel. */
export function InstallButton({ appName, className, variant = "outline", size = "md", label }: {
  appName: string; className?: string; variant?: "outline" | "primary" | "brand"; size?: "md" | "lg" | "xl"; label?: string;
}) {
  const { available, canPrompt, install } = useInstall();
  const [guide, setGuide] = useState(false);
  if (!available) return null;
  return (
    <>
      <Button variant={variant} size={size} className={className}
        onClick={async () => { if (canPrompt) { if (await install()) toast.success(`${appName} added to your home screen`); } else setGuide(true); }}>
        <Download className="h-4.5 w-4.5" strokeWidth={1.75} /> {label ?? "Install app"}
      </Button>
      <IOSGuide open={guide} onOpenChange={setGuide} appName={appName} />
    </>
  );
}

const KEY = "wc-install-dismissed";

/** Customer banner: appears after the second visit or 25 s of browsing, never again once dismissed. */
export default function InstallBanner() {
  const { available, canPrompt, install } = useInstall();
  const [show, setShow] = useState(false);
  const [guide, setGuide] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!available) return;
    try {
      if (localStorage.getItem(KEY)) return;
      const visits = Number(localStorage.getItem("wc-visits") ?? 0) + 1;
      localStorage.setItem("wc-visits", String(visits));
      if (visits >= 2) { setShow(true); return; }
    } catch {}
    const t = setTimeout(() => setShow(true), 25000);
    return () => clearTimeout(t);
  }, [available]);

  const dismiss = () => { setShow(false); try { localStorage.setItem(KEY, "1"); } catch {} };

  return (
    <>
      <AnimatePresence>
        {show && available && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(4px)", transition: { duration: 0.15 } }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="fixed inset-x-3 bottom-[calc(92px+env(safe-area-inset-bottom))] z-40 lg:bottom-4 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink p-3 pl-4 text-white shadow-[var(--shadow-pop)]"
            role="dialog" aria-label="Install the app"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="" className="h-10 w-10 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium">Add Wisdom Computers to your phone</p>
              <p className="text-[12.5px] text-white/65">Check stock in one tap, no app store.</p>
            </div>
            <Button size="sm" variant="brand" onClick={async () => { if (canPrompt) { await install(); dismiss(); } else setGuide(true); }}>Add</Button>
            <button onClick={dismiss} aria-label="Not now" className="grid h-9 w-9 place-items-center rounded-full text-white/60 hover:text-white"><X className="h-4.5 w-4.5" /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <IOSGuide open={guide} onOpenChange={(v) => { setGuide(v); if (!v) dismiss(); }} appName="Wisdom Computers" />
    </>
  );
}
