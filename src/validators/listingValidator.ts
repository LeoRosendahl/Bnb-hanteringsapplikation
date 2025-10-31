import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'

const schema: z.ZodType<Partial<NewListing>> = z.object({
    name: z.string().min(1, "Name required"),
    description: z.string().min(5,"Five or more letters"),
    location: z.string().min(1, "Location is required"),
    price_per_night: z.coerce.number(),
    availability: z.boolean()
})

const listingValidator = zValidator("json", schema, (result, c) => {
    console.log(listingValidator)
    if(!result.success) {
        return c.json({error: result.error.issues}, 400)
    }
})

export default listingValidator;