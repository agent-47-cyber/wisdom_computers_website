import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEMO, SUPABASE_PUBLIC } from "@/lib/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_PUBLIC.url;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLIC.publishableKey;

/** null in demo mode: the data layer then uses sample data in localStorage. */
export const supabase: SupabaseClient | null = DEMO ? null : createClient(url, key);

export const BUCKET = "product-images";
