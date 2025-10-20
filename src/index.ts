import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import dotenv from "dotenv";
import usersApp from './routes/users.js';
import { HTTPException } from "hono/http-exception";
import { supabase } from "./lib/supabase.js";
import authApp from './routes/auth.js';
dotenv.config();

const app = new Hono( {
  strict: false
});

const serverStartTime = Date.now()

app.use("*", (c,next) => {
  c.set("supabase", supabase)
  return next()
})
// auth routing
app.route("/auth", authApp)
// routing for users
app.route("/users", usersApp)

app.get('/', (c) => {
  return c.text('Hello Honoooo!')
})


app.onError((err, c) => {
  if(err instanceof HTTPException){
    console.log("managed risk error")
    return err.getResponse()
  }
  console.log("unexpected error", err)
  return c.json({ error: "Internal server error" }, 500);
})


serve({
  fetch: app.fetch,
  port: Number(process.env.HONO_PORT) || 4001,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
