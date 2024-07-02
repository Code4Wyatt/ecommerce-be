import { z } from 'zod'

export const SignupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    city: z.string(),
    country: z.string(),
    postCode: z.string().length(7)
})