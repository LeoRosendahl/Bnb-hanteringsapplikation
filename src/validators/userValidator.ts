import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import slugify from 'slugify';

const schema = z.object({
    id: z.number().optional(),
    username: z.string().min(3, "Username is required over 2 letters"),
    email: z.string().email("Valid email is required"),
})

const userValidator = zValidator("json", schema, (result, c) => {
    if(!result.success) {
        return c.json({error: result.error.issues}, 400)
    }
})

export default userValidator;