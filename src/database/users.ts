import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";

// get users
export const getUsers = async () => {
    const query = supabase.from("users").select("*");
    const users: PostgrestSingleResponse<User[]> = await query
    console.log(users)
    return users.data
}
// get user by Id

// post user
export const createUsers = async (user: NewUser) => {
    const query = supabase.from("users").insert(user).select().single();
    const response: PostgrestSingleResponse<User> = await query;
    return response
}
// delete user

// put users