# Wisdom Computers — shop website + staff app

Website for **Wisdom Computers**, a computer store, repair shop and training institute in Pratap Nagar, Jaipur.
Customers browse live stock and courses, then buy or enquire on **WhatsApp**. Counter staff manage stock from a
phone app (**Wisdom Stock**) built for people with no tech background.

## Highlights

- **Live stock** from Postgres (Supabase) with filter, sort, search and a shareable quick view (`/products/?p=<id>`)
- **⌘K / Ctrl+K command palette** (cmdk) across stock, courses and shop actions
- **WhatsApp-native checkout**: every Buy/Enquire button opens a chat with the item, price and ID pre-typed
- **Responsive modal**: Base UI dialog on desktop, Vaul swipe-to-close drawer on phones
- **Two installable PWAs** from one codebase: shop app at `/`, staff app at `/admin/` (own name, icon, manifest)
- **Staff app**: 3-step add flow (photo → type + name → price), one-tap Sold with undo, in-browser photo compression (~200 KB WebP)
- **Role-based security** in the database (Row Level Security): public read, staff write, admin delete
- **Demo mode**: `NEXT_PUBLIC_DEMO=1` runs the site and staff app on sample data in localStorage — no backend needed
- Local SEO: `ComputerStore` JSON-LD with address, hours and rating; static export; works on slow data with an offline page

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, static export), React 19, TypeScript |
| Styling | Tailwind CSS 4, semantic tokens in `globals.css` (see `DESIGN.md`) |
| Components | shadcn-style primitives on Base UI, Vaul, cmdk, Sonner, NumberFlow, Motion |
| State | zustand (shared catalog store) |
| Backend | Supabase: Postgres, Auth, Storage |
| Hosting | Cloudflare Pages (free, commercial use allowed) |
| Ops | GitHub Action pings Supabase every 3 days so the free project never pauses (needs repo secrets `SUPABASE_URL`, `SUPABASE_ANON_KEY`) |

## Project structure

```
src/
  app/                      routes only
    page.tsx                home
    products/page.tsx       stock
    courses/page.tsx        courses
    admin/                  staff app (own manifest via layout.tsx)
  components/
    ui/                     primitives: button, badge, input, price, responsive-modal, icons
    layout/                 Header, Footer, Providers (toaster, search, quick view, install banner)
    home/                   home-page sections (StockBoard, CategoryRail, ChatPreview…)
    shop/                   ProductCard, ProductBrowser, ProductQuickView, CourseCard, SearchPalette
    pwa/                    install button, iOS guide, install banner
    admin/                  AdminApp, ProductManager, ProductWizard, CourseManager, Login
  lib/
    site.ts                 ← shop details: address, phone, WhatsApp, hours, rating
    data.ts                 data layer — Supabase or demo backend behind one API
    store.ts                zustand stores
    supabase.ts, images.ts, pwa.ts, useMedia.ts, utils.ts
public/
  manifest.webmanifest      shop app
  staff.webmanifest         staff app
  sw.js, offline.html, icons/
supabase/schema.sql         tables, RLS policies, storage bucket, starter courses, indexes
.github/workflows/          Supabase keep-alive
DESIGN.md                   design system lock
```

## Run locally

```powershell
npm install
npm run dev        # http://localhost:3000 — live Supabase data
npm run build      # static site in /out
npm run deploy     # build + upload to Cloudflare Pages
```

## Deploy

Supabase is already set up (schema, RLS, storage bucket, starter courses). To publish:

```powershell
# first time only: cleans old files, installs, logs in to Cloudflare, creates the project, deploys
powershell -ExecutionPolicy Bypass -File .\setup-and-deploy.ps1

# every update after that
npm run deploy
```

This creates the Cloudflare Pages project `wisdom-computers` and prints the live URL
(`https://wisdom-computers.pages.dev`). Run it again after any change.

Add a staff member: Supabase → Authentication → Users → **Add user** (tick Auto Confirm), then in SQL Editor:

```sql
insert into public.staff (user_id, role) select id, 'worker' from auth.users where email = 'their@email.com';
```

## Staff guide

1. Owner logs in once on the worker’s phone at `yoursite/admin`, then taps **Put this on my home screen**.
2. New stock: **Products → Add product** → photo → type + name → price → **Save**.
3. Sold: tap the green **In stock** pill. It turns **Sold** (Undo appears for a few seconds).
4. Only the admin can delete.

## Still needed from the shop

- Real photos: shop front, counter and shelves, product close-ups, a class in progress
- Logo file (the app icon is a placeholder “W” mark)
- Confirm the WhatsApp number (assumed same as the shop phone) and course fees
