import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";

// get users
export const getUsers = async () => {
    const query = supabase.from("users").select("*");
    const users: PostgrestSingleResponse<Profile[]> = await query
    return users.data
}
// get user by Id
export async function getUserById(id: string): Promise<Profile> {
    const {data, error} = await supabase.from("users").select("*").eq("id", id).single()

    if(error) {
        throw error;
    }
    return data as Profile
}
// post user
export const createUsers = async (user: NewUserProfile) => {
    const query = supabase.from("users").insert(user).select().single();
    const response: PostgrestSingleResponse<Profile> = await query;
    return response
}
// delete user

// put users