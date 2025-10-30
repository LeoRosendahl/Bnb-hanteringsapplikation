import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import dotenv from "dotenv";
import usersApp from './routes/users.js';
import { HTTPException } from "hono/http-exception";
import { supabase } from "./lib/supabase.js";
import authApp from './routes/auth.js';
import { supabaseMiddleware } from './middleware/auth.js';
import listingApp from './routes/listing.js';
import bookingApp from './routes/bookings.js';
import { cors } from 'hono/cors';
dotenv.config();

const app = new Hono( {
  strict: false
});

app.use("*", cors({
   origin: ["http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))

const serverStartTime = Date.now()

app.use("*", (c,next) => {
  c.set("supabase", supabase)
  return next()
})

app.use("*", supabaseMiddleware)

// auth routing
app.route("/auth", authApp)
// routing for users
app.route("/users", usersApp)

// routing for listings
app.route("/listings", listingApp)

app.route("/bookings", bookingApp)

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
