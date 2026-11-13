"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { MotionConfig } from "motion/react";
import { useCatalog, useSaved } from "@/lib/store";
import { registerSW } from "@/lib/pwa";
import { useMedia } from "@/lib/useMedia";
import SearchPalette from "@/components/shop/SearchPalette";
import ProductQuickView from "@/components/shop/ProductQuickView";
import SavedSheet from "@/components/shop/SavedSheet";
import InstallBanner from "@/components/pwa/InstallPrompt";

export default function Providers({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const staff = path?.startsWith("/admin");
  const load = useCatalog((s) => s.load);
  const desktop = useMedia("(min-width: 1024px)");

  useEffect(() => { registerSW(); useSaved.persist.rehydrate(); }, []);
  useEffect(() => { if (!staff) load(); }, [staff, load]);

  return (
    <MotionConfig reducedMotion="user">
      {children}
      {!staff && (<><SearchPalette /><ProductQuickView /><SavedSheet /><InstallBanner /></>)}
      {/* phones: toasts at the top so they never sit on the tab bar */}
      <Toaster position={staff || !desktop ? "top-center" : "bottom-right"} richColors closeButton toastOptions={{ style: { fontFamily: "var(--font-sans)" } }} />
    </MotionConfig>
  );
}
