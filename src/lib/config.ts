/**
 * Public Supabase client config. Safe to commit: the publishable key can only do
 * what Row Level Security allows (public reads; writes need a staff login).
 * Override with NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY if needed.
 */
export const SUPABASE_PUBLIC = {
  url: "https://yifidrpqfvtedcdubxro.supabase.co",
  publishableKey: "sb_publishable__JA-S-7RbXYy6Af1ISyXCg_mmrST3mT",
};

/** Set NEXT_PUBLIC_DEMO=1 to run on sample data stored in the browser (no backend). */
export const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";
