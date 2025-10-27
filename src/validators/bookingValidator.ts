import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'

const schema: z.ZodType<Partial<NewBooking>> = z.object({
    check_in_date: z.string(),
    check_out_date: z.string(),
    total_price: z.number()
})

const bookingValidator = zValidator("json", schema, (result, c) => {
    if(!result.success) {
        return c.json({error: result.error.issues}, 400)
    }
})

export default bookingValidator