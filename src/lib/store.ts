"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { listCourses, listProducts, type Course, type Product } from "@/lib/data";

/** One shared catalog store: header search, grids and quick view read the same fetch. */
type Catalog = {
  products: Product[] | null;
  courses: Course[] | null;
  error: string | null;
  loading: boolean;
  load: (force?: boolean) => Promise<void>;
};

export const useCatalog = create<Catalog>((set, get) => ({
  products: null,
  courses: null,
  error: null,
  loading: false,
  load: async (force = false) => {
    if (get().loading || (!force && get().products)) return;
    set({ loading: true });
    try {
      const [products, courses] = await Promise.all([listProducts(), listCourses()]);
      set({ products, courses, error: null });
    } catch (e) {
      set({ error: (e as Error).message ?? "Could not load" });
    } finally {
      set({ loading: false });
    }
  },
}));

/**
 * Selected product (deep-linkable via ?p=id).
 * `inline` is true while the shop page shows its side panel, so the modal stays closed.
 */
export const useQuickView = create<{
  id: string | null; inline: boolean;
  open: (id: string) => void; close: () => void; setInline: (v: boolean) => void;
}>((set) => ({
  id: null,
  inline: false,
  open: (id) => set({ id }),
  close: () => set({ id: null }),
  setInline: (inline) => set({ inline }),
}));

/** Command palette open state. */
export const useSearch = create<{ open: boolean; setOpen: (v: boolean) => void }>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

/** Saved items (heart). Kept on this device; one WhatsApp message asks about all of them. */
export const useSaved = create<{ ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean; clear: () => void }>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids] })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "wc-saved", skipHydration: true } // rehydrated in Providers after mount (avoids SSR mismatch)
  )
);

/** Saved sheet open state. */
export const useSavedSheet = create<{ open: boolean; setOpen: (v: boolean) => void }>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
