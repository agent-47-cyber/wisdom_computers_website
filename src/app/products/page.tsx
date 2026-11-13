import { Suspense } from "react";
import SiteShell from "@/components/layout/SiteShell";
import ProductBrowser from "@/components/shop/ProductBrowser";

export const metadata = {
  title: "Refurbished laptops, PCs and accessories in stock",
  description: "Live stock at Wisdom Computers, Pratap Nagar, Jaipur. Refurbished laptops, desktops, monitors, keyboards and mice. Buy on WhatsApp.",
};

export default function ProductsPage() {
  return (
    <SiteShell className="pb-16 pt-6">
      <div className="wrap">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12.5px] shadow-[var(--shadow-card)]"><span className="live-dot h-2 w-2 rounded-full bg-wa" /> Live stock</span>
        <h1 className="mt-4 text-[40px] leading-[1.02] md:text-[60px]">In stock at the shop</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-muted">Updated by the counter staff as items come in and go out. Listed prices are a starting point; the final price is agreed on WhatsApp.</p>
        <Suspense><ProductBrowser /></Suspense>
      </div>
    </SiteShell>
  );
}
