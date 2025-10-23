import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";


const listingWithAgentSelect = `id,
    name,
    description,
    location,
    price_per_night,
    availability,
    listing_agent_id,
    listing_agent:listing_agent_id (
      id
    )`
// get listings
export const getListings = async () => {
    const query = supabase.from("listings").select(listingWithAgentSelect);
    const listings = await query as PostgrestSingleResponse<listingWithAgent[]>
    return listings.data
}
// get listing by Id

// post listing
export const createListing = async (listing: NewListing, userId: string) => {
    // adding listing_agent_id from userId to the listing object
    const listingWithAgentId = {...listing, listing_agent_id: userId}

    const query = supabase.from("listings").insert(listingWithAgentId).select(listingWithAgentSelect).single();
    const response = await query as PostgrestSingleResponse<listingWithAgent>;
    return response
}
// delete listing

// put listing