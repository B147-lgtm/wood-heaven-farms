import { createClient } from "@supabase/supabase-js";

const env = (import.meta as any)?.env; // safe in case tooling is weird
const supabaseUrl = env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY as string | undefined;

// DEV-only debug (won't print secrets)
if (env?.DEV) {
  console.log("[Supabase] url present:", !!supabaseUrl, "anon present:", !!supabaseAnonKey);
}

// In production: fail loudly (no mock mode)
if (env?.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
