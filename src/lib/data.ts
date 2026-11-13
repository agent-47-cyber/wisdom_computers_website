/**
 * Data layer. One interface, two backends:
 *  - Supabase (production) when NEXT_PUBLIC_SUPABASE_* keys are set
 *  - Demo (localStorage) when they are not — the whole site and admin work offline for demos
 * Pages never talk to Supabase directly, so swapping or scaling the backend touches only this file.
 */
import { supabase, BUCKET } from "@/lib/supabase";

export type Condition = "Like New" | "Good" | "Fair";

export type Product = {
  id: string;
  name: string;
  category: string;
  condition: Condition | null;
  price: number | null;
  specs: string | null;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  sold_at?: string | null;
  created_at?: string;
};

export type Course = {
  id: string;
  name: string;
  duration: string | null;
  fee: number | null;
  batch_timings: string | null;
  exam_for: string | null;
  description: string | null;
  image: string | null;
  active: boolean;
  created_at?: string;
};

export type ProductInput = Omit<Product, "id" | "created_at" | "sold_at">;
export type CourseInput = Omit<Course, "id" | "created_at" | "image"> & { image?: string | null };

export const IS_DEMO = !supabase;

const now = Date.now();
const ago = (d: number) => new Date(now - d * 864e5).toISOString();

export const SAMPLE_PRODUCTS: Product[] = [
  { id: "d1a2b3c4-0001", name: "Dell Latitude 7490", category: "laptop", condition: "Like New", price: 18500, specs: "i5 8th gen · 8 GB RAM · 256 GB SSD · 14\" FHD", images: [], in_stock: true, featured: true, created_at: ago(1) },
  { id: "d1a2b3c4-0002", name: "Lenovo ThinkPad T480", category: "laptop", condition: "Good", price: 17000, specs: "i5 8th gen · 8 GB RAM · 256 GB SSD · 14\"", images: [], in_stock: true, featured: true, created_at: ago(2) },
  { id: "d1a2b3c4-0003", name: "HP EliteBook 840 G5", category: "laptop", condition: "Good", price: 19500, specs: "i5 8th gen · 16 GB RAM · 512 GB SSD", images: [], in_stock: true, featured: false, created_at: ago(3) },
  { id: "d1a2b3c4-0004", name: "Logitech K120 keyboard", category: "keyboard", condition: "Like New", price: 450, specs: "USB · full size · spill resistant", images: [], in_stock: true, featured: true, created_at: ago(1) },
  { id: "d1a2b3c4-0005", name: "Dell KB216 keyboard", category: "keyboard", condition: "Good", price: 400, specs: "USB · quiet keys", images: [], in_stock: true, featured: false, created_at: ago(5) },
  { id: "d1a2b3c4-0006", name: "Logitech M235 wireless mouse", category: "mouse", condition: "Like New", price: 550, specs: "2.4 GHz nano receiver", images: [], in_stock: true, featured: true, created_at: ago(2) },
  { id: "d1a2b3c4-0009", name: "Custom i5 office PC", category: "desktop", condition: "Like New", price: 21000, specs: "i5 12th gen · 16 GB RAM · 512 GB NVMe · Windows 11", images: [], in_stock: true, featured: true, created_at: ago(1) },
  { id: "d1a2b3c4-0007", name: "Dell 22\" P2219H monitor", category: "monitor", condition: "Good", price: 5200, specs: "1080p IPS · HDMI, DP, VGA", images: [], in_stock: true, featured: false, created_at: ago(4) },
  { id: "d1a2b3c4-0008", name: "65 W laptop charger", category: "other", condition: "Good", price: null, specs: "Dell / HP / Lenovo pins", images: [], in_stock: false, featured: false, sold_at: ago(1), created_at: ago(9) },
];

export const SAMPLE_COURSES: Course[] = [
  { id: "c1", name: "RS-CIT", duration: "3 months", fee: null, batch_timings: "Morning and evening batches", exam_for: "Rajasthan govt jobs that ask for RS-CIT", description: "Computer basics, MS Office, internet and e-governance, with exam practice.", image: null, active: true },
  { id: "c2", name: "Tally with GST", duration: "2–3 months", fee: null, batch_timings: "Morning and evening batches", exam_for: "Accounts jobs, shop and office billing", description: "Company setup, vouchers, inventory, GST returns and reports in Tally Prime.", image: null, active: true },
  { id: "c3", name: "Hindi typing", duration: "2 months", fee: null, batch_timings: "Hourly slots", exam_for: "RSSB LDC, Patwari, court clerk", description: "Krutidev and Mangal. Daily timed tests until you reach the speed your exam asks for.", image: null, active: true },
  { id: "c4", name: "English typing", duration: "2 months", fee: null, batch_timings: "Hourly slots", exam_for: "SSC CHSL, DEO, court and bank exams", description: "Accuracy first, then speed, on exam-style software.", image: null, active: true },
  { id: "c5", name: "Advanced Excel", duration: "1–2 months", fee: null, batch_timings: "Evening batches", exam_for: "Office, data entry and MIS jobs", description: "Formulas, lookups, pivot tables, charts and dashboards on real office data.", image: null, active: true },
  { id: "c6", name: "Advanced MS Office", duration: "2 months", fee: null, batch_timings: "Morning and evening batches", exam_for: "Office and back-office jobs", description: "Word, Excel and PowerPoint beyond the basics: templates, mail merge, reports, presentations.", image: null, active: true },
  { id: "c7", name: "DCA (Desktop Computer Applications)", duration: "6 months", fee: null, batch_timings: "Morning and evening batches", exam_for: "Students and first-time computer users", description: "Windows, MS Office, internet, typing practice and basic troubleshooting in one course.", image: null, active: true },
  { id: "c8", name: "AutoCAD for architecture", duration: "3 months", fee: null, batch_timings: "Weekday evenings", exam_for: "Diploma and B.Arch students, drafting jobs", description: "2D plans, elevations and sections, then 3D basics, drawn from real house plans.", image: null, active: true },
];

// ─── demo backend (localStorage) ───────────────────────────────────────────
const LS = { p: "wc-demo-products", c: "wc-demo-courses" };
function readLS<T>(key: string, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  try { const v = localStorage.getItem(key); if (v) return JSON.parse(v); } catch {}
  return seed;
}
function writeLS<T>(key: string, v: T[]) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}
const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Math.random()).slice(2));

// ─── public API ────────────────────────────────────────────────────────────
export async function listProducts(): Promise<Product[]> {
  if (!supabase) return readLS(LS.p, SAMPLE_PRODUCTS);
  const { data, error } = await supabase.from("products").select("*")
    .order("in_stock", { ascending: false }).order("created_at", { ascending: false }).limit(500);
  if (error) throw error;
  return data as Product[];
}

export async function listCourses(includeHidden = false): Promise<Course[]> {
  if (!supabase) {
    const all = readLS(LS.c, SAMPLE_COURSES);
    return includeHidden ? all : all.filter((c) => c.active);
  }
  let q = supabase.from("courses").select("*").order("created_at", { ascending: true });
  if (!includeHidden) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return data as Course[];
}

export async function saveProduct(input: ProductInput, id?: string): Promise<Product> {
  if (!supabase) {
    const all = readLS(LS.p, SAMPLE_PRODUCTS);
    const row: Product = id
      ? { ...all.find((p) => p.id === id)!, ...input }
      : { ...input, id: uid(), created_at: new Date().toISOString() };
    writeLS(LS.p, id ? all.map((p) => (p.id === id ? row : p)) : [row, ...all]);
    return row;
  }
  const q = id
    ? supabase.from("products").update(input).eq("id", id).select().single()
    : supabase.from("products").insert(input).select().single();
  const { data, error } = await q;
  if (error) throw error;
  return data as Product;
}

export async function setInStock(id: string, inStock: boolean) {
  const patch = { in_stock: inStock, sold_at: inStock ? null : new Date().toISOString() };
  if (!supabase) {
    writeLS(LS.p, readLS(LS.p, SAMPLE_PRODUCTS).map((p) => (p.id === id ? { ...p, ...patch } : p)));
    return;
  }
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  if (!supabase) { writeLS(LS.p, readLS(LS.p, SAMPLE_PRODUCTS).filter((p) => p.id !== id)); return; }
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function saveCourse(input: CourseInput, id?: string): Promise<Course> {
  if (!supabase) {
    const all = readLS(LS.c, SAMPLE_COURSES);
    const row: Course = id ? { ...all.find((c) => c.id === id)!, ...input, image: input.image ?? null }
      : { ...input, image: input.image ?? null, id: uid(), created_at: new Date().toISOString() };
    writeLS(LS.c, id ? all.map((c) => (c.id === id ? row : c)) : [...all, row]);
    return row;
  }
  const q = id
    ? supabase.from("courses").update(input).eq("id", id).select().single()
    : supabase.from("courses").insert(input).select().single();
  const { data, error } = await q;
  if (error) throw error;
  return data as Course;
}

export async function deleteCourse(id: string) {
  if (!supabase) { writeLS(LS.c, readLS(LS.c, SAMPLE_COURSES).filter((c) => c.id !== id)); return; }
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
}

/** Uploads an already-compressed image; demo mode keeps it as a data URL. */
export async function uploadImage(blob: Blob): Promise<string> {
  if (!supabase) {
    return await new Promise((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(blob); });
  }
  const path = `${new Date().toISOString().slice(0, 10)}/${uid()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

