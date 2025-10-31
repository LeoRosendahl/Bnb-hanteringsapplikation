// middleware/auth.ts
import type { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
// INGEN ANING OM VAD DETTA GÖR TA HJÄLP
import type { User as SupabaseUser } from "@supabase/auth-js";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "../lib/supabase.js";

// Gör så att Hono's Context känner till "supabase"
declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
    // INGEN ANING OM DETTA BE OM HJÄLP
    user: SupabaseUser | null;
  }
}

// Viktigt: rätt signatur + return-typ = Promise<void>
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

  // Det här steget är avgörande
  await next();

}


export async function requireAuth(c: Context, next: Next) {
  const supabase = c.get("supabase");

  // checking if supabase client exists
  if(!supabase) {
    return c.json({error: "Supabase client not found"})
  }
  const {data, error} = await supabase.auth.getUser();
  const user = data.user
  //TODO: ta bort return next och ta ner c.set("user", user || null ) till antingen if eller under den googla
  c.set("user", user || null )
  return next()
  if(error || !user) {
    return c.json({error: "Unauthorized"}, 401);
  }
  await next()
}