"use client";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut, Laptop, GraduationCap, ChevronRight, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { IS_DEMO, listCourses, listProducts, type Course, type Product } from "@/lib/data";
import { Count } from "@/components/ui/price";
import { InstallButton } from "@/components/pwa/InstallPrompt";
import { LogoMark } from "@/components/ui/logo";
import Login from "@/components/admin/Login";
import ProductManager from "@/components/admin/ProductManager";
import CourseManager from "@/components/admin/CourseManager";
import type { Role } from "@/components/admin/types";

type View = "home" | "products" | "courses";

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(IS_DEMO ? "admin" : null);
  const [ready, setReady] = useState(IS_DEMO);
  const [view, setView] = useState<View>("home");
  const [startAdd, setStartAdd] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("add")) { setView("products"); setStartAdd(true); }
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); if (!data.session) setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session) { if (!IS_DEMO) setRole(null); return; }
    supabase.from("staff").select("role").eq("user_id", session.user.id).maybeSingle()
      .then(({ data }) => { setRole((data?.role as Role) ?? null); setReady(true); });
  }, [session]);

  const refresh = useCallback(async () => {
    const [p, c] = await Promise.all([listProducts(), listCourses(true)]);
    setProducts(p); setCourses(c);
  }, []);
  useEffect(() => { if (role) refresh(); }, [role, refresh]);

  if (!ready) return <Shell><div className="mt-20 h-8 w-40 animate-pulse rounded-lg bg-surface" /></Shell>;
  if (!IS_DEMO && !session) return <Shell><Login /></Shell>;
  if (!role) {
    return (
      <Shell>
        <h1 className="mt-10 text-[28px]">No access yet</h1>
        <p className="mt-2 text-[16px] text-muted">{session?.user.email} is not on the staff list. Ask the owner to add you, then open this page again.</p>
        <button className="mt-6 h-12 rounded-xl border border-line px-5" onClick={() => supabase!.auth.signOut()}>Log out</button>
      </Shell>
    );
  }

  const inStock = products.filter((p) => p.in_stock).length;
  const week = Date.now() - 7 * 864e5;
  const soldWeek = products.filter((p) => !p.in_stock && p.sold_at && new Date(p.sold_at).getTime() > week).length;

  return (
    <Shell
      demo={IS_DEMO}
      right={!IS_DEMO && (
        <button onClick={() => supabase!.auth.signOut()} className="flex h-10 items-center gap-2 rounded-xl px-3 text-[14px] text-white/70 hover:bg-bg/10 hover:text-white">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      )}
    >
      {view === "home" && (
        <div className="space-y-4 pb-10">
          <div className="grid grid-cols-3 gap-2">
            {[["In stock", inStock], ["Sold this week", soldWeek], ["Courses live", courses.filter((c) => c.active).length]].map(([l, n]) => (
              <div key={l as string} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <Count value={n as number} className="text-[30px] font-medium leading-[1.1] tracking-tight" />
                <p className="mt-2 text-[12.5px] leading-tight text-muted">{l}</p>
              </div>
            ))}
          </div>
          <Tile icon={<Laptop className="h-7 w-7" strokeWidth={1.5} />} title="Products" sub="Add new stock, mark sold" onClick={() => setView("products")} />
          <Tile icon={<GraduationCap className="h-7 w-7" strokeWidth={1.5} />} title="Courses" sub="Fees, batches, show or hide" onClick={() => setView("courses")} />
          <div className="flex flex-col gap-2 pt-4">
            <InstallButton appName="Wisdom Stock" label="Put this on my home screen" size="xl" variant="primary" className="w-full" />
            <a href="/" target="_blank" className="flex h-12 items-center justify-center gap-2 text-[14px] text-muted"><ExternalLink className="h-4 w-4" /> Open the shop website</a>
          </div>
          <p className="text-center text-[12.5px] text-muted">Logged in as {IS_DEMO ? "demo admin" : session?.user.email} · {role}</p>
        </div>
      )}
      {view === "products" && <ProductManager role={role} items={products} refresh={refresh} onBack={() => setView("home")} startAdd={startAdd} />}
      {view === "courses" && <CourseManager role={role} items={courses} refresh={refresh} onBack={() => setView("home")} />}
    </Shell>
  );
}

function Tile({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 rounded-[24px] bg-card p-5 text-left shadow-[var(--shadow-card)] transition-[scale,box-shadow] duration-150 active:scale-[0.98]">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-accent">{icon}</span>
      <span className="flex-1"><span className="block text-[24px] tracking-tight">{title}</span><span className="text-[14px] text-muted">{sub}</span></span>
      <ChevronRight className="h-6 w-6 text-muted" />
    </button>
  );
}

function Shell({ children, right, demo }: { children: React.ReactNode; right?: React.ReactNode; demo?: boolean }) {
  return (
    <div className="min-h-svh bg-bg">
      <header className="sticky top-0 z-30 bg-ink pt-[env(safe-area-inset-top)] text-white">
        <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
          <span className="flex items-center gap-2.5 font-medium">
            <LogoMark variant="staff" className="h-7 w-7" /> Wisdom Stock
          </span>
          {right}
        </div>
        {demo && <p className="bg-accent px-4 py-1.5 text-center text-[12.5px]">Demo mode: changes stay on this device until Supabase is connected.</p>}
      </header>
      <main className="mx-auto max-w-xl px-4 pt-5">{children}</main>
    </div>
  );
}
