"use client";
import { ArrowLeft } from "lucide-react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";

/** Top bar inside a staff screen: big back button + title + optional action. */
export function AdminBar({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <button onClick={onBack} aria-label="Back" className="grid h-12 w-12 place-items-center rounded-2xl bg-card shadow-[var(--shadow-card)] transition-[scale] active:scale-[0.96]">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="flex-1 text-[24px] tracking-tight">{title}</h1>
      {action}
    </div>
  );
}

/** Admin-only delete confirmation. */
export function ConfirmDelete({ open, onOpenChange, name, onConfirm }: {
  open: boolean; onOpenChange: (v: boolean) => void; name: string; onConfirm: () => void;
}) {
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title={`Delete ${name}`} className="md:w-[420px]">
      <div className="p-5 md:p-6">
        <h2 className="pr-10 text-[22px] leading-tight">Delete “{name}” for good?</h2>
        <p className="mt-2 text-[15px] text-muted">This can’t be undone. To just hide it, mark it Sold instead.</p>
        <div className="mt-6 grid gap-2">
          <Button variant="danger" size="lg" onClick={() => { onConfirm(); onOpenChange(false); }}>Delete</Button>
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>Keep it</Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}

/** Plain-language error for staff. */
export function friendlyError(e: unknown) {
  const m = (e as Error)?.message ?? "";
  if (/fetch|network|Failed to/i.test(m)) return "Not saved. Check the internet and try again.";
  if (/row-level security|permission|42501/i.test(m)) return "You don’t have permission for this. Ask the owner.";
  return "Not saved. Try again, or tell the owner.";
}

/** Big action button pinned above the phone's home bar. */
export function StickyActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-bg via-bg/95 to-bg/0 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-6">
      <div className="mx-auto max-w-xl">{children}</div>
    </div>
  );
}
