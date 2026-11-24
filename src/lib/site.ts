// ─── Shop details — edit here, used everywhere ─────────────────────────────
export const SITE = {
  name: "Wisdom Computers",
  tagline: "Computer store, classes and typing center",
  city: "Jaipur",
  street: "86/169, Kumbha Marg, Sector 8",
  area: "Pratap Nagar, Jaipur 302033",
  phone: "+91 98872 57421",
  phoneHref: "tel:+919887257421",
  // WhatsApp Business for all enquiries (90572 96436): country code first, digits only
  whatsapp: "919057296436",
  whatsappDisplay: "+91 90572 96436",
  hours: "Mon–Sat, 8 am – 9 pm",
  hoursShort: "8 am – 9 pm",
  openDays: [1, 2, 3, 4, 5, 6], // 0 = Sunday
  openHour: 8,
  closeHour: 21,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wisdom+Computers+Kumbha+Marg+Sector+8+Pratap+Nagar+Jaipur",
  // Google rating as shown on the Business Profile — update when it changes
  google: { rating: 4.3, reviews: 46, asOf: "Nov 2026" },
  url: "https://wisdom-computers.pages.dev",
};

export const CATEGORIES = [
  { id: "laptop", label: "Laptops" },
  { id: "desktop", label: "Desktops & PCs" },
  { id: "monitor", label: "Monitors" },
  { id: "keyboard", label: "Keyboards" },
  { id: "mouse", label: "Mice" },
  { id: "other", label: "Accessories" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Accessories";
}

export const SERVICES = [
  { id: "repair", title: "Laptop and desktop repair", body: "Bring it to the counter for a check-up. Screens, keyboards, batteries, slow systems, Windows reinstalls.", ask: "Hi Wisdom Computers, my laptop/PC needs repair. Problem: " },
  { id: "custom", title: "Custom-assembled PCs", body: "Tell us the budget and the work: office, study, editing or gaming. We put the parts list together.", ask: "Hi Wisdom Computers, I want a custom PC. Budget: ₹ , use: " },
  { id: "jobwork", title: "Printing, toner refill, online forms", body: "Printouts, toner refilling and government or exam form filling at the shop.", ask: "Hi Wisdom Computers, I need help with: " },
] as const;

/** WhatsApp chat link with a ready-made message. */
export function waLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function rupees(n: number | null | undefined) {
  if (n == null) return null;
  return "₹" + n.toLocaleString("en-IN");
}

export function productMessage(p: { id: string; name: string; price: number | null }) {
  const price = rupees(p.price);
  return `Hi ${SITE.name}, I'm interested in: ${p.name}${price ? ` (listed at ${price})` : ""} [ID ${p.id.slice(0, 8)}]. Is it available?`;
}

/** Open right now? Uses India time regardless of the visitor's timezone. */
export function openNow(d = new Date()) {
  const ist = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const h = ist.getHours() + ist.getMinutes() / 60;
  return SITE.openDays.includes(ist.getDay()) && h >= SITE.openHour && h < SITE.closeHour;
}

export const COURSE_GROUPS = [
  { id: "all", label: "All courses" },
  { id: "govt", label: "Govt exams" },
  { id: "office", label: "Office and accounts" },
  { id: "design", label: "Design" },
] as const;

export type CourseGroup = (typeof COURSE_GROUPS)[number]["id"];

/** Groups a course by its name, so new courses added in /admin land in the right tab. */
export function courseGroup(name: string): Exclude<CourseGroup, "all"> {
  const n = name.toLowerCase();
  if (/autocad|cad|design|photoshop|corel|3d/.test(n)) return "design";
  if (/rs-?cit|typing|ccc|rscit/.test(n)) return "govt";
  return "office";
}

/** Brands we look for in product names (filters and the brand row only show ones in stock). */
export const BRANDS = ["Dell", "HP", "Lenovo", "Acer", "ASUS", "Apple", "Samsung", "LG", "Logitech", "Intel", "AMD", "BenQ", "Zebronics", "Microsoft"] as const;

export function brandOf(name: string): string | null {
  const n = name.toLowerCase();
  return BRANDS.find((b) => new RegExp(`\\b${b.toLowerCase()}\\b`).test(n)) ?? null;
}

export const PRICE_BANDS = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "u5", label: "Under ₹5,000", min: 0, max: 5000 },
  { id: "5-15", label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { id: "15-25", label: "₹15,000 – ₹25,000", min: 15000, max: 25000 },
  { id: "25+", label: "Above ₹25,000", min: 25000, max: Infinity },
] as const;

export const CONDITIONS = ["Like New", "Good", "Fair"] as const;
