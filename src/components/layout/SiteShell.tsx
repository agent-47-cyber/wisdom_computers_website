import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { cn } from "@/lib/utils";

/** Public pages: soft canvas, floating header, footer, phone tab bar. */
export default function SiteShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="site min-h-svh">
      <Header />
      <main id="main" className={cn(className)}>{children}</main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
