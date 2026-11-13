"use client";
import { useState } from "react";
import { Clock, Target } from "lucide-react";
import type { Course } from "@/lib/data";
import { SITE, waLink } from "@/lib/site";
import { Price } from "@/components/ui/price";
import { ArrowChip, Button, buttonVariants } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { WhatsAppIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const SLOTS = ["Morning", "Afternoon", "Evening"] as const;

export default function CourseCard({ c, index }: { c: Course; index?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <article className="card card-hover flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          {index != null && <span className="font-mono text-[12px] text-muted">{String(index + 1).padStart(2, "0")}</span>}
          <span className="text-right text-[15px] font-medium">
            <Price value={c.fee} ask="Fee on WhatsApp" className={c.fee == null ? "text-muted font-normal text-[13px]" : ""} />
          </span>
        </div>
        <h3 className="mt-8 text-[26px] leading-[1.1] tracking-tight">{c.name}</h3>
        {c.description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.description}</p>}
        <ul className="mt-5 space-y-2 text-[14px]">
          {c.exam_for && <li className="flex gap-2.5"><Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />{c.exam_for}</li>}
          {c.duration && <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />{c.duration}{c.batch_timings ? ` · ${c.batch_timings}` : ""}</li>}
        </ul>
        <Button variant="brand" className="mt-6 w-full justify-between pr-1.5" onClick={() => setOpen(true)}>
          Ask about the next batch <ArrowChip className="h-8 w-8" />
        </Button>
      </article>
      <EnquiryModal course={c} open={open} onOpenChange={setOpen} />
    </>
  );
}

/** Two-field enquiry that composes a WhatsApp message — no backend, no lost leads. */
export function EnquiryModal({ course, open, onOpenChange }: { course: Course; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>("Morning");
  const msg = `Hi ${SITE.name}, I'm ${name || "interested"}. I want to join ${course.name}. Preferred batch: ${slot}. Please share the fee and next start date.`;

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title={`Enquire about ${course.name}`} className="md:w-[480px]">
      <div className="p-5 md:p-6">
        <p className="text-[13px] text-muted">Course enquiry</p>
        <h2 className="mt-1 pr-10 text-[26px] leading-tight">{course.name}</h2>
        <div className="mt-6">
          <Label htmlFor={`n-${course.id}`}>Your name</Label>
          <Input id={`n-${course.id}`} placeholder="Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <fieldset className="mt-5">
          <legend className="mb-2 text-[15px] font-medium">Preferred batch</legend>
          <div className="grid grid-cols-3 gap-2">
            {SLOTS.map((s) => (
              <button key={s} type="button" onClick={() => setSlot(s)} aria-pressed={slot === s}
                className={cn("h-11 rounded-xl border text-[14px] transition-[background-color,border-color,color] duration-150",
                  slot === s ? "border-ink bg-ink text-white" : "border-line bg-card hover:bg-surface")}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        <a href={waLink(msg)} target="_blank" rel="noopener" onClick={() => onOpenChange(false)}
          className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }), "mt-6 w-full")}>
          <WhatsAppIcon /> Send on WhatsApp
        </a>
        <p className="mt-3 text-center text-[12.5px] text-muted">Or call {SITE.phone}</p>
      </div>
    </ResponsiveModal>
  );
}
