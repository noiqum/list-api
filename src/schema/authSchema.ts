import { z } from "zod"


export const registerSchema = z.object({
    name: z.string().min(3, "name must be at least 3 characters long"),
    email: z.string().email("must be a valid email"),
    password: z.string().min(8, "password must be at least 8 characters long")
})

export const loginSchema = z.object({
    email: z.string().email("must be a valid email"),
    password: z.string().min(8, "password must be at least 8 characters long")
})