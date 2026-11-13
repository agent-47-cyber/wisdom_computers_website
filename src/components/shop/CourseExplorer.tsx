"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useCatalog } from "@/lib/store";
import { COURSE_GROUPS, courseGroup, type CourseGroup } from "@/lib/site";
import CourseCard from "@/components/shop/CourseCard";
import { cn } from "@/lib/utils";

/** Course grid with animated group tabs. `limit` trims the list on the home page. */
export default function CourseExplorer({ limit }: { limit?: number }) {
  const { courses, error } = useCatalog();
  const [group, setGroup] = useState<CourseGroup>("all");
  const list = useMemo(
    () => (courses ?? []).filter((c) => group === "all" || courseGroup(c.name) === group).slice(0, limit),
    [courses, group, limit]
  );

  return (
    <>
      <LayoutGroup>
        <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0" role="tablist" aria-label="Course type">
          {COURSE_GROUPS.map((g) => (
            <button key={g.id} role="tab" aria-selected={group === g.id} onClick={() => setGroup(g.id)}
              className={cn("relative h-10 shrink-0 rounded-full px-4 text-[14px] transition-[color] duration-150", group === g.id ? "text-white" : "bg-card text-ink/75 shadow-[var(--shadow-card)] hover:text-ink")}>
              {group === g.id && <motion.span layoutId="course-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0, duration: 0.35 }} />}
              <span className="relative">{g.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      {error && <p className="mt-8 text-muted">Courses could not load. Ask us on WhatsApp.</p>}
      <motion.div layout className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {!courses && !error && [0, 1, 2].map((i) => <div key={i} className="h-80 animate-pulse rounded-[28px] bg-card" aria-hidden="true" />)}
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((c, i) => (
            <motion.div key={c.id} id={c.id} layout className="scroll-mt-24"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.15 } }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
              <CourseCard c={c} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
