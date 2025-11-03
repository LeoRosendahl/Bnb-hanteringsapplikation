import { Hono } from "hono";
import { supabase } from "../lib/supabase.js";
import bookingValidator from "../validators/bookingValidator.js";
import * as db from "../database/bookings.js"
import type { PostgrestSingleResponse, User } from "@supabase/supabase-js";
import { requireAuth, supabaseMiddleware } from "../middleware/auth.js";



const bookingApp = new Hono();

bookingApp.post("/", requireAuth, bookingValidator, async (c) => {

    try {
        // take authenticated user and inserts in to booking

        const user = c.get("user");
        const sb = c.get("supabase")

        if (!user) {
            return c.json({ error: "User not authenticated" }, 401)
        }

        // gets the booking data from request and listing_id
        const bookingData: NewBooking = await c.req.json();
        
        // take listing_id and inserts in to new booking,
        // this will come from the FE or Postman request
        const { listing_id } = bookingData;
        if (!listing_id) {
            return c.json({ error: "listing_id is missing" }, 400)
        }
        // send data to createBooking funktion in Database/mapp
        const response = await db.createBooking(sb,bookingData, user.id, listing_id)

        return c.json(response, 201)

    } catch (error) {
        return c.json({ errro: (error as Error).message }, 500)
    }

})

// get booking, only RLS authorized can see
bookingApp.get("/", requireAuth, async (c) => {
    const sb = c.get("supabase")
    try {
        const booking = await db.getBookings(sb);
        return c.json(booking)
    } catch (error) {
        return c.json({ error: (error as Error).message }, 500)
    }
})


bookingApp.get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
     const sb = c.get("supabase")
    const booking = await db.getBookingsById(sb,id);

    if (!booking) {
        return c.json({ error: "Booking not found" }, 404);
    }
    return c.json(booking);
})

//  delete booking by id
bookingApp.delete("/:id", requireAuth, async (c) => {
 const sb = c.get("supabase")
    try {
        const bookingId = c.req.param("id");
        const user = c.get("user");
        if (!user) {
            return c.json({ error: "User not authenticated" }, 401)
        }

        await db.deleteBookingById(sb,bookingId, user.id);

        return c.json({ message: "Booking deleted successfully" }, 200);

    } catch (error) {
        console.log(error)  
        return c.json({ error: "Error deleting booking" }, 404);
    }
});
export default bookingApp;