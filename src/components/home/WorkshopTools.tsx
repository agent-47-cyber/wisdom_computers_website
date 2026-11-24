"use client";
import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { Check, GraduationCap, Wrench } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { BorderBeam, DotGrid } from "@/components/magic/effects";
import { cn } from "@/lib/utils";

const COURSE_TRACKS = [
  { id: "Govt Exam Prep", courses: "RS-CIT · Hindi & English Typing", sub: "LDC, Patwari, SSC, court & Rajasthan govt jobs" },
  { id: "Accounts & Billing", courses: "Tally Prime with GST · Advanced Excel", sub: "Shop billing, GST returns, office accounts" },
  { id: "Office & Basics", courses: "DCA · Advanced MS Office", sub: "Students, beginners & back-office jobs" },
  { id: "Coding & Design", courses: "C / C++ Programming · AutoCAD", sub: "College students, diploma & drafting work" },
] as const;

const BATCH_SLOTS = ["Morning", "Afternoon", "Evening", "Crash Course"] as const;

const SERVICE_TYPES = [
  {
    id: "Laptop / PC Repair",
    options: ["Slow / Hanging", "Broken Screen", "Battery / Charging", "Keyboard / Hinge", "Windows / Software", "Onsite Visit"],
  },
  {
    id: "Sales & Accessories",
    options: ["Refurbished Laptop", "New Laptop / Desktop", "Custom PC Assembly", "Keyboard / Mouse / Charger", "Monitor / SSD / RAM"],
  },
  {
    id: "Printing & Forms",
    options: ["Color / B&W Print", "Toner Refill", "Govt / Exam Form", "Hindi / English Typing"],
  },
] as const;

export default function WorkshopTools() {
  const [mode, setMode] = useState<"course" | "counter">("course");

  // Course finder state
  const [trackId, setTrackId] = useState<(typeof COURSE_TRACKS)[number]["id"]>("Govt Exam Prep");
  const [slot, setSlot] = useState<(typeof BATCH_SLOTS)[number]>("Morning");
  const activeTrack = COURSE_TRACKS.find((t) => t.id === trackId)!;

  // Counter service state
  const [serviceId, setServiceId] = useState<(typeof SERVICE_TYPES)[number]["id"]>("Laptop / PC Repair");
  const activeService = SERVICE_TYPES.find((s) => s.id === serviceId)!;
  const [picked, setPicked] = useState<string[]>(["Slow / Hanging"]);

  function switchService(id: (typeof SERVICE_TYPES)[number]["id"]) {
    setServiceId(id);
    const next = SERVICE_TYPES.find((s) => s.id === id)!;
    setPicked([next.options[0]]);
  }

  function togglePick(item: string) {
    setPicked((prev) => (prev.includes(item) ? (prev.length > 1 ? prev.filter((x) => x !== item) : prev) : [...prev, item]));
  }

  const courseMessage = `Hi ${SITE.name}, I want to enquire about computer classes.\n• Track: ${activeTrack.id} (${activeTrack.courses})\n• Preferred batch: ${slot}\nPlease share the fee and next batch start date.`;

  const counterMessage = `Hi ${SITE.name}, I need help with ${serviceId}.\n• Requirement: ${picked.join(", ")}\nPlease share details / estimate.`;

  return (
    <section id="workshop-tools" className="wrap scroll-mt-24 pt-20">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-accent">Quick Counter Desk</p>
          <h2 className="mt-1.5 text-[28px] leading-[1.08] md:text-[40px]">Find a course batch or message the counter in 10 seconds.</h2>
        </div>

        <LayoutGroup id="workshop-mode">
          <div className="inline-flex w-fit rounded-full bg-card p-1.5 shadow-[var(--shadow-card)] ring-1 ring-ink/[0.05]" role="tablist" aria-label="Quick desk tool">
            {[
              { id: "course" as const, label: "Course & Batch Finder", Icon: GraduationCap },
              { id: "counter" as const, label: "Repair · Sales · Forms", Icon: Wrench },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={mode === id}
                onClick={() => setMode(id)}
                className={cn(
                  "relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors",
                  mode === id ? "text-white" : "text-ink/70 hover:text-ink"
                )}
              >
                {mode === id && (
                  <motion.span
                    layoutId="ws-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className="card grid gap-6 overflow-hidden p-5 ring-1 ring-ink/[0.05] md:p-8 lg:grid-cols-[1.25fr_0.95fr]">
        {/* Left interactive controls */}
        {mode === "course" ? (
          <div className="space-y-6">
            <div>
              <p className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-muted">1. What are you preparing for?</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {COURSE_TRACKS.map((t) => {
                  const on = trackId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTrackId(t.id)}
                      aria-pressed={on}
                      className={cn(
                        "flex flex-col rounded-2xl border p-4 text-left transition-[background-color,border-color,transform] duration-150 active:scale-[0.98]",
                        on
                          ? "border-ink bg-ink text-white shadow-sm"
                          : "border-line bg-surface/70 text-ink hover:border-ink/25 hover:bg-surface"
                      )}
                    >
                      <span className="flex items-center justify-between text-[15.5px] font-medium">
                        {t.id}
                        {on && <Check className="h-4 w-4 text-brand" />}
                      </span>
                      <span className={cn("mt-1 text-[12.5px] font-medium", on ? "text-brand" : "text-accent")}>{t.courses}</span>
                      <span className={cn("mt-0.5 text-[12.5px]", on ? "text-white/65" : "text-muted")}>{t.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-muted">2. Preferred batch timing</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {BATCH_SLOTS.map((s) => {
                  const on = slot === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      aria-pressed={on}
                      className={cn(
                        "h-11 rounded-full border px-4 text-[14px] font-medium transition-[background-color,border-color,transform] duration-150 active:scale-[0.97]",
                        on ? "border-brand bg-brand text-ink" : "border-line bg-card text-ink hover:bg-surface"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-muted">1. Choose service</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {SERVICE_TYPES.map((s) => {
                  const on = serviceId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => switchService(s.id)}
                      aria-pressed={on}
                      className={cn(
                        "h-12 rounded-2xl border px-3 text-[14px] font-medium transition-[background-color,border-color,transform] duration-150 active:scale-[0.97]",
                        on ? "border-ink bg-ink text-white" : "border-line bg-surface/70 text-ink hover:bg-surface"
                      )}
                    >
                      {s.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-muted">2. Tap what you need (pick one or more)</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeService.options.map((item) => {
                  const on = picked.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => togglePick(item)}
                      aria-pressed={on}
                      className={cn(
                        "inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium transition-[background-color,border-color,transform] duration-150 active:scale-[0.97]",
                        on ? "border-brand bg-brand text-ink" : "border-line bg-card text-ink hover:bg-surface"
                      )}
                    >
                      {on && <Check className="h-3.5 w-3.5" />}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="rounded-2xl bg-surface p-4 text-[14px] leading-relaxed text-muted">
              Walk in at <strong className="font-medium text-ink">{SITE.street}</strong> ({SITE.hours}) — in-store pickup, onsite service & delivery available. UPI / Google Pay, Debit Card & NFC accepted.
            </p>
          </div>
        )}

        {/* Right: Live Obsidian Ticket Preview with BorderBeam */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-ink p-6 text-white">
          <BorderBeam />
          <DotGrid className="text-white/[0.07]" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brand">
                {mode === "course" ? "Course Enquiry" : "Counter Request"}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] text-white/75">WhatsApp Ready</span>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
              {mode === "course" ? (
                <>
                  <Row label="Track" value={activeTrack.id} />
                  <Row label="Courses" value={activeTrack.courses} accent />
                  <Row label="Batch" value={slot} />
                </>
              ) : (
                <>
                  <Row label="Desk" value={serviceId} />
                  <Row label="Need" value={picked.join(" · ")} accent />
                  <Row label="Center" value="Kumbha Marg, Pratap Nagar" />
                </>
              )}
            </div>
          </div>

          <div className="relative z-10 mt-6 space-y-2.5">
            <a
              href={waLink(mode === "course" ? courseMessage : counterMessage)}
              target="_blank"
              rel="noopener"
              className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "w-full")}
            >
              <WhatsAppIcon className="h-5 w-5" />
              {mode === "course" ? "Ask fee & batch on WhatsApp" : "Send to counter on WhatsApp"}
            </a>
            <p className="text-center text-[12.5px] text-white/60">
              Direct WhatsApp ({SITE.whatsappDisplay}) · Or call {SITE.phone}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/50">{label}</span>
      <span className={cn("text-right text-[14px] font-medium", accent ? "text-brand" : "text-white")}>{value}</span>
    </div>
  );
}
