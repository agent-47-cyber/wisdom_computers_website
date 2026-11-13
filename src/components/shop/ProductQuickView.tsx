"use client";
import { useEffect } from "react";
import { useCatalog, useQuickView } from "@/lib/store";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import ProductDetail from "@/components/shop/ProductDetail";

/** Product modal / phone sheet. Stays closed while the shop page shows its own side panel. Deep link: /products/?p=<id> */
export default function ProductQuickView() {
  const { id, inline, open, close } = useQuickView();
  const products = useCatalog((s) => s.products);
  const p = products?.find((x) => x.id === id) ?? null;

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("p");
    if (q) open(q);
  }, [open]);

  return (
    <ResponsiveModal open={!!p && !inline} onOpenChange={(v) => !v && close()} title={p?.name ?? "Product"} description="Product details" className="md:w-[min(980px,calc(100vw-48px))]">
      {p && <ProductDetail p={p} />}
    </ResponsiveModal>
  );
}
