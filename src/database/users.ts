import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";

// get users
export const getUsers = async () => {
    const query = supabase.from("users").select("*");
    const users: PostgrestSingleResponse<Profile[]> = await query
    console.log(users)
    return users.data
}
// get user by Id

// post user
export const createUsers = async (user: NewUserProfile) => {
    const query = supabase.from("users").insert(user).select().single();
    const response: PostgrestSingleResponse<Profile> = await query;
    return response
}
// delete user

// put users