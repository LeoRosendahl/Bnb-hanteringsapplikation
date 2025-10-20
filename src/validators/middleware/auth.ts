// middleware/auth.ts
import type { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../../lib/supabase.js";

// 🧩 Gör så att Hono's Context känner till "supabase"
declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
  }
}

// 🧠 Viktigt: rätt signatur + return-typ = Promise<void>
export async function supabaseMiddleware(c: Context, next: Next): Promise<void> {
  // Skapa Supabase-klienten för varje request
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header("Cookie") ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" })
        );
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
            ...options,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        });
      },
    },
  });

  // Lägg till i context så du kan använda c.get("supabase") i routes
  c.set("supabase", supabase);

  // 🧩 Det här steget är avgörande
  await next();

  // (returnera ingenting)
}
