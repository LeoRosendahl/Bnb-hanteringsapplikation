import { Hono } from "hono";
import fs from "fs/promises";
import { HTTPException } from "hono/http-exception";
import { supabase } from "../lib/supabase.js";
import userValidator from "../validators/userValidator.js";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";


const authApp = new Hono()

authApp.post("/register", async (c) => {
  const { email, password, name } = await c.req.json();
  const sb = c.get("supabase");
  const {data, error} = await sb.auth.signUp({ email, password});
  
  if (error) return c.json({ error: error.message }, 400)

  const userId = data.user?.id;
  if(!userId) {
    throw new HTTPException(500, {
      res: c.json({error: "User creation failed"}, 500)
    });
  }

  // lägger till den nya användaren i min tabell
  const {error: insertError } = await sb.from("users").insert([{ id: userId, email, name }]);

  if (insertError) {
    console.log( "inserterror: ", insertError)
    throw new HTTPException(400, {
      res: c.json({error: insertError.message}, 400)
    })
  }
  return c.json({ message: "User registered", userId}, 200)
});

// login function for auth users
authApp.post("/login", async (c) => {
  const {email, password} = await c.req.json();
  // kan man ha user istället för supabase här?
  const sb = c.get("supabase")
  const {data, error} = await sb.auth.signInWithPassword({
    email,
    password
  });
  console.log(data?.session?.access_token)
  if (error) {
    throw new HTTPException(400, {
      res: c.json({error: "Invalid credentials"}, 400)
    });
  };
  return c.json(data.user, 200)
})

// logout function
authApp.post("/logout", async (c) => {
  const sb = c.get("supabase")
  try{
    const {error} = await sb.auth.signOut();
    if(error) {
      return c.json({error: error.message}, 400)
    }
    return c.json({message: "Logged out successfully"})
  }catch(error) {
    return c.json({error: "Logout failed"}, 500)
  }
})

export default authApp;