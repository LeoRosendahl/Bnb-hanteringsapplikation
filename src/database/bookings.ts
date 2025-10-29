import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";


const selectBookingsWithListingAndUserId = `id,
check_in_date,
check_out_date,
total_price,
listing_id,
user_id,
listing:listing_id (
    id,
    name,
    price_per_night,
    listing_agent: listing_agent_id (
     id,
     email,
     name   
    )
    ),
user: user_id (
    id,
    email,
    name
)` 

// get all bookings
export const getBookings = async (sb: SupabaseClient) => {
    const query = sb.from("bookings").select(selectBookingsWithListingAndUserId);
    const bookings = await query as PostgrestSingleResponse<BookingWithUserAndListing[]>
    return bookings.data
}

// create booking
export const createBooking = async (sb: SupabaseClient,booking: NewBooking, userId: string, listingId: string) => {
   const bookingWithUserIdAndListingId = {...booking, user_id: userId, listing_id: listingId}
   const query = sb.from("bookings").insert(bookingWithUserIdAndListingId).select(selectBookingsWithListingAndUserId).single();
   const response = await query as PostgrestSingleResponse<BookingWithUserAndListing>
   
   // Uppdatera availability till false EFTER att bokningen skapats
  if (response.data) {
    const { error: updateError } = await sb
      .from("listings")
      .update({ availability: false })
      .eq("id", listingId);

    if (updateError) {
      console.error("Failed to update listing availability:", updateError.message);
    }
  }
   return response
}

// get booking by Id.. Will be booking made by users
// And listing angent
export async function getBookingsById(sb: SupabaseClient ,id: string): Promise<Booking> {
    const {data, error}: PostgrestSingleResponse<BookingWithUserAndListing> = await sb.from("bookings").select(selectBookingsWithListingAndUserId).eq("id", id).single()
    if (!data) {
    throw new Error("Booking not found");
  }
    if(error) {
        throw error;
    }
    return data
}

// delete booking by Id
export async function deleteBookingById(sb: SupabaseClient,id: string, userId: string): Promise<void> {
    const {error} = await sb.from("bookings").delete().eq("id", id).eq("user_id", userId).select().single()

    if(error) {
    //    with throw use try catch in route
        throw error;
    }
    return
}
