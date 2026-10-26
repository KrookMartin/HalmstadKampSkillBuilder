import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Database } from "./types";

// Use this in Server Components, Server Actions, and Route Handlers.
// It must be called inside a request context because it reads cookies.
export async function createClient() {
  // Supabase reads Date.now() (e.g. to check session expiry). With Cache
  // Components, Next may prerender with cookies available but forbids the
  // clock until connection() says "this is request time". DB data is always
  // per-request anyway, so mark it here once for every caller.
  await connection();
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from Server Components where cookies are read-only.
            // The middleware will handle session refresh in those cases.
          }
        },
      },
    }
  );
}
