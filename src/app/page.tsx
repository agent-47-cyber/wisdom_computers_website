import Link from "next/link";
import SiteShell from "@/components/layout/SiteShell";
import HeroBento from "@/components/home/HeroBento";
import { BrandStrip, CategoryGrid, FeaturedProducts, HowItWorks, PromoBanners, SectionHead, Services, ValueStrip, Visit } from "@/components/home/sections";
import CourseExplorer from "@/components/shop/CourseExplorer";
import { ArrowChip, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <SiteShell className="pb-10">
      <HeroBento />
      <ValueStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanners />
      <BrandStrip />
      <section className="wrap pt-20">
        <SectionHead
          title="Computer classes"
          sub="RS-CIT, Tally with GST, Hindi and English typing, Excel, MS Office, DCA and AutoCAD. Morning to evening batches."
          action={<Link href="/courses/" className={cn(buttonVariants({ variant: "outline" }), "hidden pr-1.5 sm:inline-flex")}>All courses <ArrowChip className="h-8 w-8" /></Link>}
        />
        <CourseExplorer limit={6} />
      </section>
      <HowItWorks />
      <Services />
      <Visit />
    </SiteShell>
  );
}
