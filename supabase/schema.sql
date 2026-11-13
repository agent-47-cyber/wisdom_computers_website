-- Wisdom Computers database — mirrors the migrations applied to the live project.
-- Fresh project: Supabase → SQL Editor → paste → Run (once).

-- ─── Tables ────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'other'
    check (category in ('laptop','desktop','monitor','keyboard','mouse','other')),
  condition text check (condition in ('Like New','Good','Fair')),
  price int check (price is null or price >= 0),          -- null = "Ask for price"
  specs text,
  images text[] not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false,
  sold_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration text,
  fee int check (fee is null or fee >= 0),
  batch_timings text,
  exam_for text,
  description text,
  image text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.staff (
  user_id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('admin','worker'))
);

create index if not exists products_stock_idx on public.products (in_stock, created_at desc);
create index if not exists products_category_idx on public.products (category);

-- ─── Role helpers (private schema: not callable through the public API) ─────
create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_staff() returns boolean
language sql security definer stable set search_path = '' as $$
  select exists (select 1 from public.staff where user_id = (select auth.uid()))
$$;
create or replace function private.is_admin() returns boolean
language sql security definer stable set search_path = '' as $$
  select exists (select 1 from public.staff where user_id = (select auth.uid()) and role = 'admin')
$$;
revoke all on function private.is_staff(), private.is_admin() from public;
grant execute on function private.is_staff(), private.is_admin() to anon, authenticated;

-- ─── Row Level Security: public reads, staff writes, admin deletes ─────────
alter table public.products enable row level security;
alter table public.courses  enable row level security;
alter table public.staff    enable row level security;

create policy "public read products"  on public.products for select using (true);
create policy "staff insert products" on public.products for insert to authenticated with check ((select private.is_staff()));
create policy "staff update products" on public.products for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "admin delete products" on public.products for delete to authenticated using ((select private.is_admin()));

create policy "public read courses"  on public.courses for select using (active or (select private.is_staff()));
create policy "staff insert courses" on public.courses for insert to authenticated with check ((select private.is_staff()));
create policy "staff update courses" on public.courses for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "admin delete courses" on public.courses for delete to authenticated using ((select private.is_admin()));

create policy "read own staff row" on public.staff for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

-- ─── Storage: public bucket for product photos ─────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 2097152, array['image/webp','image/jpeg','image/png'])
on conflict (id) do nothing;

create policy "staff upload images" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and (select private.is_staff()));
create policy "admin delete images" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and (select private.is_admin()));

-- ─── Starter courses (fees set later in /admin) ────────────────────────────
insert into public.courses (name, duration, batch_timings, exam_for, description) values
  ('RS-CIT', '3 months', 'Morning and evening batches', 'Rajasthan govt jobs that ask for RS-CIT', 'Computer basics, MS Office, internet and e-governance, with exam practice.'),
  ('Tally with GST', '2–3 months', 'Morning and evening batches', 'Accounts jobs, shop and office billing', 'Company setup, vouchers, inventory, GST returns and reports in Tally Prime.'),
  ('Hindi typing', '2 months', 'Hourly slots', 'RSSB LDC, Patwari, court clerk', 'Krutidev and Mangal. Daily timed tests until you reach the speed your exam asks for.'),
  ('English typing', '2 months', 'Hourly slots', 'SSC CHSL, DEO, court and bank exams', 'Accuracy first, then speed, on exam-style software.'),
  ('Advanced Excel', '1–2 months', 'Evening batches', 'Office, data entry and MIS jobs', 'Formulas, lookups, pivot tables, charts and dashboards on real office data.'),
  ('Advanced MS Office', '2 months', 'Morning and evening batches', 'Office and back-office jobs', 'Word, Excel and PowerPoint beyond the basics: templates, mail merge, reports, presentations.'),
  ('DCA (Desktop Computer Applications)', '6 months', 'Morning and evening batches', 'Students and first-time computer users', 'Windows, MS Office, internet, typing practice and basic troubleshooting in one course.'),
  ('AutoCAD for architecture', '3 months', 'Weekday evenings', 'Diploma and B.Arch students, drafting jobs', '2D plans, elevations and sections, then 3D basics, drawn from real house plans.');

-- ─── Staff: create the login in Authentication → Users → Add user, then: ──
-- insert into public.staff (user_id, role) select id, 'admin'  from auth.users where email = 'owner@example.com';
-- insert into public.staff (user_id, role) select id, 'worker' from auth.users where email = 'worker@example.com';
