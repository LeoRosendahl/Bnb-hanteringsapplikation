import { Hono } from "hono";
import { supabase } from "../lib/supabase.js";
import userValidator from "../validators/userValidator.js";
import * as db from "../database/users.js"
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

const usersApp = new Hono();



usersApp.get("/", async (c) => {
    const users = await db.getUsers();
    return c.json(users)
});

export default usersApp;
