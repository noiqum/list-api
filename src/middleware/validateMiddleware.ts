import { Request, Response, NextFunction } from "express"
import { ZodObject, ZodError } from "zod"
import { sendError } from "../utils/responseUtils"

export const validateMiddleware = (schema: ZodObject<any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages: string = error.errors.map(err => {
                    return `${err.path[0]}--${err.message}--`
                }).join("")
                sendError(res, `invalid data: ${errorMessages}`, 404)
            } else {
                sendError(res, "internal service error", 500)
            }

        }
    }
}