import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";
import type { Context } from "hono";


const listingWithAgentSelect = `id,
    name,
    description,
    location,
    price_per_night,
    availability,
    listing_agent_id,
    listing_agent:listing_agent_id (
      id,
      name
    )`
// get listings
export const getListings = async () => {
    const query = supabase.from("listings").select(listingWithAgentSelect);
    const listings = await query as PostgrestSingleResponse<listingWithAgent[]>
    return listings.data
}

// get listing by Id
export async function getListingById(id: string): Promise<Listing> {
    const {data, error} = await supabase.from("listings").select("*").eq("id", id).single()

    if(error) {
        throw error;
    }
    return data as Listing
}

// post listing
export const createListing = async (sb: SupabaseClient, listing: NewListing, userId: string) => {
    // adding listing_agent_id from userId to the listing object
    // -------------------------------------------------------------LISTING_AGENT_ID: userId-----------------------------------------------------------------------
    const listingWithAgentId = {...listing, listing_agent_id: "0cb26f7e-1cc2-4b8f-8426-45ba7cb15771"}
    console.log("listingWithAgentId", listingWithAgentId)
    const query = sb.from("listings").insert(listingWithAgentId).select(listingWithAgentSelect).single();
    const response = await query as PostgrestSingleResponse<listingWithAgent>;
    return response
}
// delete listing
export async function deleteListing(sb: SupabaseClient, id: string): Promise<Listing> {
    const {data, error} = await sb.from("listings").delete().eq("id", id).select().single()
    if(error) {
        throw error;
    }
    return data
}
// put listing
export async function updateListing(sb: SupabaseClient, listing: Listing): Promise<Listing | null> {

  const { data, error } = await sb.from("listings").update(listing).eq("id", listing.id).select().single();
  if(error?.code === "PGRST116") {
    return null
  }  
  if (error) {
    throw error;
  } 
    console.log(error)
  return data;
}

// export async function updateCourse(sb: SupabaseClient, id: string, course: NewCourse): Promise<Course | null> {
//   const courseWithoutId: NewCourse = {
//     ...course,
//     course_id: undefined
//   }  
//   const query = sb.from("courses").update(courseWithoutId).eq("course_id", id).select().single();
//   const response: PostgrestSingleResponse<Course> = await query;
//   return response.data;
// }