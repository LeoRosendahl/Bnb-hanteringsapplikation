interface NewBooking {
    id: string,
    check_in_date: string,
    check_out_date: string,
    total_price: number,
    listing_id: string,
    user_id: string
}

interface Booking extends NewBooking {
    id: string,
    createdAt: string
}

interface BookingWithUserAndListing extends Booking {
  listing: {
    id: string
    name: string
    price_per_night: number
  }
  user: {
    id: string
    email: string
    name: string
  }
}
