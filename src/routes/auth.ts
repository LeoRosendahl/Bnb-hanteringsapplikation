import { Hono } from "hono";
import fs from "fs/promises";
import { HTTPException } from "hono/http-exception";
import { supabase } from "../lib/supabase.js";
import userValidator from "../validators/userValidator.js";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";


const authApp = new Hono()

authApp.post("/register", async (c) => {
  const { email, password, username } = await c.req.json();
  const sb = c.get("supabase");
  // använder data, error då error är inbyggt i supabase authError hantering data
  // får värdet av email och password
  const {data, error} = await sb.auth.signUp({ email, password});
  if (error) {
    throw new HTTPException(400, {
      res: c.json({ error: error.message }, 400),
    });
  }

  const userId = data.user?.id;
  if(!userId) {
    throw new HTTPException(500, {
      res: c.json({error: "User creation failed"}, 500)
    });
  }

  // lägger till den nya användaren i min tabell
  const {error: insertError } = await sb.from("users").insert([{ id: userId, email, username }]);

  if (insertError) {
    console.log( "inserterror: ", insertError)
    throw new HTTPException(400, {
      res: c.json({error: insertError.message}, 400)
    })
  }
  return c.json({ message: "User registered", userId}, 200)
});

// authApp.post("/register", async (c) => {

// })

export default authApp;