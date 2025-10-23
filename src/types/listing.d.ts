interface NewListing {
    id?: string,
    name: string,
    description: string,
    location: string,
    price_per_night: Number,
    availability: Boolean
    listing_agent_id: string
}

interface Listing extends NewListing {
    id: string
}

interface listingWithAgent extends Listing {
    listing_agent: {
        id: string
    }
}