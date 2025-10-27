import { Hono } from "hono";
import { supabase } from "../lib/supabase.js";
import listingValidator from "../validators/listingValidator.js";
import * as db from "../database/listing.js"
import type { PostgrestSingleResponse, User } from "@supabase/supabase-js";
import { requireAuth, supabaseMiddleware } from "../middleware/auth.js";

const listingApp = new Hono();

listingApp.post("/", requireAuth, listingValidator, async (c) => {
    // get user to use as listing_agent_id
    const sb = c.get("supabase")
    const user = c.get("user")!

    // this gets the listing data from the request
    const listingData: NewListing = await c.req.json();

    // this will sen data to createListing with user.id
    const response = await db.createListing(sb, listingData, user.id)
    console.log(response)

    if (response.error) {
        return c.json({ error: response.error.message }, 400)
    }

    return c.json({ message: "Listing created", listing: response.data }, 201);

})

listingApp.get("/", async (c) => {
    try {
        const listings = await db.getListings();
        console.log(listings)
        return c.json(listings)
    } catch (error) {
        return c.json({ error: (error as Error).message }, 500)
    }
});

// get listing by ID
listingApp.get("/:id", async (c) => {
    const id = c.req.param("id");
    const listing = await db.getListingById(id);

    if (!listing) {
        return c.json({ error: "Listing not found" }, 404);
    }
    return c.json(listing);
});

// delete listing
listingApp.delete("/:id", requireAuth, async (c) => {
    const id = c.req.param("id");
    const sb = c.get("supabase")
    const user = c.get("user")
    if (!user) {
        return c.json({ error: "Unothorizes" }, 401)
    }
    try {
        const deletedListing = await db.deleteListing(sb, id)

        if (!deletedListing) {
            // inget matchades/fanns att ta bort
            return c.json({ error: "Listing not found or could not be deleted" }, 404);
        }

        return c.json({ message: "Listing deleted successfully", listing: deletedListing }, 200)
    } catch(error: any) {
        return c.json({error: error.message}, 400)
    }
   
})


// update listing
listingApp.put("/:id", requireAuth, async (c) => {
    const id = c.req.param("id"); const sb = c.get("supabase"); const user = c.get("user");

    if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const listingData: Listing = await c.req.json();
    listingData.id = id;

    try {
        const updatedListing = await db.updateListing(sb, listingData);
        if (!updatedListing) {
            return c.json({ error: "listing not found" }, 404)
        }
        return c.json({ message: "Listing updated", listing: updatedListing }, 200);
    } catch (error: any) {

        return c.json({ error: error.message }, 400);
    }
});
export default listingApp;