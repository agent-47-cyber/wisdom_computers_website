"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera, Check, ChevronDown, ImagePlus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { saveProduct, type Condition, type Product, type ProductInput } from "@/lib/data";
import { CATEGORIES } from "@/lib/site";
import { uploadPhoto } from "@/lib/images";
import { CategoryIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { AdminBar, ConfirmDelete, StickyActions, friendlyError } from "@/components/admin/AdminBar";
import { cn } from "@/lib/utils";

type Props = {
  product: Product | null; // null = add new
  canDelete: boolean;
  onDelete: (p: Product) => void;
  onDone: () => Promise<void>;
  onClose: () => void;
};

const EMPTY: ProductInput = { name: "", category: "laptop", condition: "Good", price: null, specs: "", images: [], in_stock: true, featured: false };
const CONDITIONS: Condition[] = ["Like New", "Good", "Fair"];
const STEPS = ["Photo", "What is it?", "Price"] as const;

/**
 * Adding: 3 big steps (photo → type + name → price), one question per screen.
 * Editing: the same fields on one page.
 */
export default function ProductWizard({ product, canDelete, onDelete, onDone, onClose }: Props) {
  const editing = !!product;
  const [f, setF] = useState<ProductInput>(product ? { ...product } : EMPTY);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [nameErr, setNameErr] = useState(false);
  const [more, setMore] = useState(editing);
  const [saved, setSaved] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setF((s) => ({ ...s, [k]: v }));

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, 6 - f.images.length);
    setUploading(list.length);
    try {
      for (const file of list) {
        const url = await uploadPhoto(file);
        setF((s) => ({ ...s, images: [...s.images, url] }));
        setUploading((n) => n - 1);
      }
    } catch (e) {
      toast.error(friendlyError(e));
    } finally {
      setUploading(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function go(to: number) {
    if (step === 1 && to > 1 && !f.name.trim()) { setNameErr(true); return; }
    setDir(to > step ? 1 : -1);
    setStep(to);
  }

  async function save() {
    if (!f.name.trim()) { setNameErr(true); if (!editing) go(1); return; }
    setBusy(true);
    try {
      await saveProduct({ ...f, name: f.name.trim(), specs: f.specs?.trim() || null }, product?.id);
      await onDone();
      if (editing) { toast.success("Saved"); onClose(); }
      else setSaved(f.name.trim());
    } catch (e) {
      toast.error(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  // ─── success screen ────────────────────────────────────────────────────
  if (saved) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="flex min-h-[70svh] flex-col items-center justify-center text-center">
        <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0, duration: 0.45, delay: 0.05 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-wa-soft text-wa-ink"><Check className="h-10 w-10" strokeWidth={2} /></motion.span>
        <h2 className="mt-6 text-[30px] leading-tight">Added</h2>
        <p className="mt-2 max-w-xs text-[16px] text-muted">{saved} is on the website now.</p>
        <div className="mt-10 grid w-full gap-2">
          <Button size="xl" onClick={() => { setF(EMPTY); setStep(0); setSaved(null); setMore(false); }}>Add another</Button>
          <Button size="xl" variant="outline" onClick={onClose}>Back to list</Button>
        </div>
      </motion.div>
    );
  }

  // ─── field blocks (shared by wizard and edit page) ─────────────────────
  const photoBlock = (
    <div>
      <input ref={fileRef} id="photos" type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} />
      {f.images.length === 0 && uploading === 0 ? (
        <label htmlFor="photos" className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-line bg-card text-muted transition-[border-color] active:border-accent">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-accent"><Camera className="h-8 w-8" strokeWidth={1.5} /></span>
          <span className="text-[17px] text-ink">Tap to take a photo</span>
          <span className="text-[14px]">Up to 6. Good light, plain background.</span>
        </label>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {f.images.map((u, i) => (
            <div key={u} className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-md bg-ink/80 px-1.5 py-0.5 text-[11px] text-white">Cover</span>}
              <button type="button" onClick={() => set("images", f.images.filter((x) => x !== u))} aria-label={`Remove photo ${i + 1}`}
                className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-ink/80 text-white"><X className="h-4 w-4" /></button>
            </div>
          ))}
          {Array.from({ length: uploading }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-surface" aria-label="Uploading" />)}
          {f.images.length + uploading < 6 && (
            <label htmlFor="photos" className="grid aspect-square cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-line bg-card text-muted">
              <ImagePlus className="h-7 w-7" strokeWidth={1.5} /><span className="sr-only">Add photo</span>
            </label>
          )}
        </div>
      )}
    </div>
  );

  const typeBlock = (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Type">
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" role="radio" aria-checked={f.category === c.id} onClick={() => set("category", c.id)}
            className={cn("flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-card p-2 text-[13px] transition-[border-color,background-color]",
              f.category === c.id ? "border-ink bg-surface" : "border-transparent shadow-[var(--shadow-card)]")}>
            <CategoryIcon category={c.id} className="h-8 w-8 text-accent" />
            <span className="text-center leading-tight">{c.label}</span>
          </button>
        ))}
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={f.name} placeholder="Dell Latitude 7490" className={cn("h-14 text-[18px]", nameErr && "border-red-600")}
          onChange={(e) => { set("name", e.target.value); setNameErr(false); }} aria-invalid={nameErr} aria-describedby={nameErr ? "name-err" : undefined} />
        {nameErr && <p id="name-err" className="mt-2 text-[14px] text-red-700">Type the product name first.</p>}
      </div>
    </div>
  );

  const priceBlock = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="price">Price</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[28px] text-muted">₹</span>
          <Input id="price" inputMode="numeric" placeholder="18,500" className="h-18 pl-11 text-[30px] font-medium tracking-tight tabular"
            value={f.price != null ? f.price.toLocaleString("en-IN") : ""}
            onChange={(e) => { const d = e.target.value.replace(/\D/g, ""); set("price", d ? Math.min(Number(d), 9_999_999) : null); }} />
        </div>
        <p className="mt-2 text-[14px] text-muted">Leave empty to show “Ask for price”.</p>
      </div>

      <div className="rounded-2xl bg-card shadow-[var(--shadow-card)]">
        <button type="button" onClick={() => setMore(!more)} aria-expanded={more} className="flex h-14 w-full items-center justify-between px-4 text-[16px]">
          More details <span className="text-[13px] text-muted">optional</span>
          <ChevronDown className={cn("h-5 w-5 text-muted transition-[rotate] duration-200", more && "rotate-180")} />
        </button>
        {more && (
          <div className="space-y-5 border-t border-line p-4">
            <fieldset>
              <legend className="mb-2 text-[15px] font-medium">Condition</legend>
              <div className="grid grid-cols-3 gap-2">
                {CONDITIONS.map((c) => (
                  <button key={c} type="button" onClick={() => set("condition", c)} aria-pressed={f.condition === c}
                    className={cn("h-12 rounded-xl border text-[15px] transition-[background-color,color,border-color]", f.condition === c ? "border-ink bg-ink text-white" : "border-line bg-card")}>{c}</button>
                ))}
              </div>
            </fieldset>
            <div>
              <Label htmlFor="specs">Specs</Label>
              <Textarea id="specs" value={f.specs ?? ""} onChange={(e) => set("specs", e.target.value)} placeholder="i5 8th gen · 8 GB RAM · 256 GB SSD" />
              <p className="mt-1.5 text-[13px] text-muted">Separate with · or commas.</p>
            </div>
            <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 text-[16px]">
              Show on home page
              <input type="checkbox" className="h-6 w-6 accent-[var(--color-ink)]" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} />
            </label>
            {editing && (
              <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 text-[16px]">
                In stock
                <input type="checkbox" className="h-6 w-6 accent-[var(--color-ink)]" checked={f.in_stock} onChange={(e) => set("in_stock", e.target.checked)} />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ─── edit: everything on one page ──────────────────────────────────────
  if (editing) {
    return (
      <div className="space-y-8 pb-32">
        <AdminBar title="Edit product" onBack={onClose}
          action={canDelete && (
            <button onClick={() => setConfirm(true)} aria-label="Delete product" className="grid h-12 w-12 place-items-center rounded-2xl text-red-700 hover:bg-red-50"><Trash2 className="h-5 w-5" /></button>
          )} />
        {photoBlock}
        {typeBlock}
        {priceBlock}
        <StickyActions><Button size="xl" className="w-full" onClick={save} disabled={busy || uploading > 0}>{busy ? "Saving…" : "Save changes"}</Button></StickyActions>
        <ConfirmDelete open={confirm} onOpenChange={setConfirm} name={product.name} onConfirm={() => onDelete(product)} />
      </div>
    );
  }

  // ─── add: three steps ──────────────────────────────────────────────────
  const blocks = [photoBlock, typeBlock, priceBlock];
  return (
    <div className="pb-32">
      <AdminBar title="New product" onBack={() => (step === 0 ? onClose() : go(step - 1))} action={<span className="text-[14px] text-muted">Step {step + 1} of 3</span>} />
      <div className="mb-6 grid grid-cols-3 gap-1.5" aria-hidden="true">
        {STEPS.map((s, i) => <span key={s} className={cn("h-1.5 rounded-full transition-[background-color] duration-300", i <= step ? "bg-accent" : "bg-line")} />)}
      </div>
      <h2 className="mb-5 text-[28px] leading-tight">{step === 0 ? "Take a photo" : step === 1 ? "What is it?" : "Price"}</h2>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div key={step} custom={dir}
          initial={{ opacity: 0, x: dir * 24, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: dir * -12, filter: "blur(4px)", transition: { duration: 0.12 } }}
          transition={{ type: "spring", bounce: 0, duration: 0.35 }}>
          {blocks[step]}
        </motion.div>
      </AnimatePresence>

      <StickyActions>
        {step < 2 ? (
          <div className="grid gap-2">
            <Button size="xl" className="w-full" onClick={() => go(step + 1)} disabled={uploading > 0}>
              {uploading > 0 ? "Uploading photo…" : "Next"}
            </Button>
            {step === 0 && f.images.length === 0 && (
              <button onClick={() => go(1)} className="h-11 text-[15px] text-muted">No photo yet, skip</button>
            )}
          </div>
        ) : (
          <Button size="xl" variant="whatsapp" className="w-full" onClick={save} disabled={busy}>
            <Check className="h-6 w-6" /> {busy ? "Saving…" : "Save"}
          </Button>
        )}
      </StickyActions>
    </div>
  );
}

