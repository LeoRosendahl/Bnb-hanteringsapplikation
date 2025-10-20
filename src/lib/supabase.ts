import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const _supabaseUrl = process.env.SUPABASE_URL;
const _supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!_supabaseUrl || !_supabaseAnonKey) {
  throw new Error(
    "Supabase not initialized. Add SUPABASE_URL and SUPABASE_ANON_KEY to environment variables."
  );
}

const supabaseUrl = _supabaseUrl;
const supabaseAnonKey = _supabaseAnonKey;

declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { supabaseUrl, supabaseAnonKey };
