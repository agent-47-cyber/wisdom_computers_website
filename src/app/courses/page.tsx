import SiteShell from "@/components/layout/SiteShell";
import CourseExplorer from "@/components/shop/CourseExplorer";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Computer courses: RS-CIT, Tally with GST, typing, Excel, AutoCAD",
  description: `RS-CIT, Tally with GST, Hindi and English typing, Advanced Excel, MS Office, DCA and AutoCAD classes at ${SITE.name}, Pratap Nagar, Jaipur.`,
};

export default function CoursesPage() {
  return (
    <SiteShell className="pb-16 pt-6">
      <div className="wrap">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12.5px] shadow-[var(--shadow-card)]">Computer classes</span>
        <h1 className="mt-4 text-[40px] leading-[1.02] md:text-[60px]">Classes in Pratap Nagar</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-muted">For govt exams, office jobs and college. Pick a course, choose a batch time, and we’ll send the fee and next start date on WhatsApp.</p>
        <div className="mt-10"><CourseExplorer /></div>
      </div>
    </SiteShell>
  );
}
