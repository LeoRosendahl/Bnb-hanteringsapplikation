import { Hono } from "hono";
import { supabase } from "../lib/supabase.js";
import listingValidator from "../validators/listingValidator.js";
import * as db from "../database/listing.js"
import type { PostgrestSingleResponse, User } from "@supabase/supabase-js";
import { requireAuth, supabaseMiddleware } from "../middleware/auth.js";

const listingApp = new Hono();

listingApp.post("/", requireAuth, listingValidator, async (c) => {
    // get user to use as listing_agent_id
    const user = c.get("user")! 
   
    // this gets the listing data from the request
    const listingData: NewListing = await c.req.json();

    // this will sen data to createListing with user.id
    const response = await db.createListing(listingData, user.id)
    console.log(response)

    if (response.error) {
        return c.json({error: response.error.message})
    }
 
    return c.json({message: "Listing created", listing: response.data}, 201);

})

export default listingApp;