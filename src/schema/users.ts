import { z } from 'zod'

const signupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})