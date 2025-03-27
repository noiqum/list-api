import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { sendError } from "../utils/responseUtils"

export interface AuthRequest extends Request {
    user?: { name: string; email: string, id: string }
}

export const authMiddleware = () => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const token = req.headers.token || req.cookies.token
        if (!token) {
            sendError(res, "Access Denied. No token provided!", 401)
            return
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { name: string, id: string, email: string, iat: number, exp: number }
            req.user = decoded
            next()
        } catch (error) {
            sendError(res, "invalid token", 401)
        }

    }
}


