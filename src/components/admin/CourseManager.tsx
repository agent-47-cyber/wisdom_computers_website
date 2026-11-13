"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCourse, saveCourse, type Course, type CourseInput } from "@/lib/data";
import { rupees } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { AdminBar, ConfirmDelete, StickyActions, friendlyError } from "@/components/admin/AdminBar";
import type { Role } from "@/components/admin/types";
import { cn } from "@/lib/utils";

type Props = { role: Role; items: Course[]; refresh: () => Promise<void>; onBack: () => void };

const EMPTY: CourseInput = { name: "", duration: "", fee: null, batch_timings: "", exam_for: "", description: "", active: true };

export default function CourseManager({ role, items, refresh, onBack }: Props) {
  const [editing, setEditing] = useState<Course | "new" | null>(null);

  async function toggle(c: Course) {
    try {
      await saveCourse({ ...c, active: !c.active }, c.id);
      await refresh();
      toast.success(c.active ? `${c.name} hidden from website` : `${c.name} shown on website`);
    } catch (e) { toast.error(friendlyError(e)); }
  }

  if (editing) {
    return (
      <CourseForm
        course={editing === "new" ? null : editing}
        canDelete={role === "admin"}
        onClose={() => setEditing(null)}
        onSaved={async () => { await refresh(); setEditing(null); }}
      />
    );
  }

  return (
    <div className="pb-28">
      <AdminBar title="Courses" onBack={onBack} />
      <ul className="space-y-2">
        {items.map((c) => (
          <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <button onClick={() => setEditing(c)} className="min-w-0 flex-1 text-left" aria-label={`Edit ${c.name}`}>
              <span className="block truncate text-[16px] font-medium">{c.name}</span>
              <span className="block text-[14px] text-muted">{c.duration || "—"} · {rupees(c.fee) ?? "Fee not set"}</span>
            </button>
            <button onClick={() => toggle(c)} aria-label={c.active ? `Hide ${c.name}` : `Show ${c.name}`}
              className={cn("h-11 shrink-0 rounded-full px-4 text-[14px] font-medium transition-[background-color,scale] active:scale-[0.96]", c.active ? "bg-wa-soft text-wa-ink" : "bg-ink text-white")}>
              {c.active ? "Shown" : "Hidden"}
            </button>
          </li>
        ))}
      </ul>
      <StickyActions>
        <Button size="xl" className="w-full" onClick={() => setEditing("new")}><Plus className="h-6 w-6" /> Add course</Button>
      </StickyActions>
    </div>
  );
}

function CourseForm({ course, canDelete, onClose, onSaved }: { course: Course | null; canDelete: boolean; onClose: () => void; onSaved: () => Promise<void> }) {
  const [f, setF] = useState<CourseInput>(course ? { ...course } : EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const set = <K extends keyof CourseInput>(k: K, v: CourseInput[K]) => setF((s) => ({ ...s, [k]: v }));

  async function save() {
    if (!f.name.trim()) { setErr(true); return; }
    setBusy(true);
    try {
      await saveCourse({ ...f, name: f.name.trim() }, course?.id);
      toast.success(course ? "Saved" : "Course added");
      await onSaved();
    } catch (e) { toast.error(friendlyError(e)); } finally { setBusy(false); }
  }

  const text = (k: "duration" | "batch_timings" | "exam_for", label: string, ph: string) => (
    <div><Label htmlFor={k}>{label}</Label><Input id={k} placeholder={ph} value={f[k] ?? ""} onChange={(e) => set(k, e.target.value)} /></div>
  );

  return (
    <div className="space-y-5 pb-32">
      <AdminBar title={course ? "Edit course" : "New course"} onBack={onClose}
        action={course && canDelete && (
          <button onClick={() => setConfirm(true)} aria-label="Delete course" className="grid h-12 w-12 place-items-center rounded-2xl text-red-700 hover:bg-red-50"><Trash2 className="h-5 w-5" /></button>
        )} />
      <div>
        <Label htmlFor="cname">Course name</Label>
        <Input id="cname" placeholder="Tally with GST" className={cn("h-14 text-[18px]", err && "border-red-600")} value={f.name}
          onChange={(e) => { set("name", e.target.value); setErr(false); }} aria-invalid={err} />
        {err && <p className="mt-2 text-[14px] text-red-700">Type the course name first.</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {text("duration", "Duration", "3 months")}
        <div>
          <Label htmlFor="fee">Fee (₹)</Label>
          <Input id="fee" inputMode="numeric" placeholder="Empty = ask" className="tabular" value={f.fee != null ? f.fee.toLocaleString("en-IN") : ""}
            onChange={(e) => { const d = e.target.value.replace(/\D/g, ""); set("fee", d ? Number(d) : null); }} />
        </div>
      </div>
      {text("batch_timings", "Batch timings", "Morning and evening")}
      {text("exam_for", "Useful for", "RSSB LDC, Patwari")}
      <div><Label htmlFor="desc">Short description</Label><Textarea id="desc" value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
      <label className="flex min-h-12 cursor-pointer items-center justify-between text-[16px]">
        Show on website <input type="checkbox" className="h-6 w-6 accent-[var(--color-ink)]" checked={f.active} onChange={(e) => set("active", e.target.checked)} />
      </label>
      <StickyActions>
        <Button size="xl" className="w-full" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
      </StickyActions>
      {course && (
        <ConfirmDelete open={confirm} onOpenChange={setConfirm} name={course.name}
          onConfirm={async () => { try { await deleteCourse(course.id); toast.success("Deleted"); await onSaved(); } catch (e) { toast.error(friendlyError(e)); } }} />
      )}
    </div>
  );
}
