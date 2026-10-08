import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Use this in Client Components ("use client").
// createBrowserClient reads the env vars once and reuses the same instance.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
