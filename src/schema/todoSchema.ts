import { z } from "zod";



export const createTodoSchema = z.object({
    userId: z.string(),
    content: z.string().min(10, "at least 10 character long"),
    complated: z.boolean(),
    dueDate: z.string(),
    tag: z.string().optional(),
    image: z.object({
        name: z.string(),
        filetype: z.string(),
        url: z.string()
    }).optional(),
    file: z.object({
        name: z.string(),
        filetype: z.string(),
        url: z.string()
    }).optional()


})