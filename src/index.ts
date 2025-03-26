import express, { Request, Response } from "express";
import authRouter from "./routes/authRoutes"
import todoRouter from "./routes/todoRoutes"
import cookieParser from "cookie-parser"

declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: 10000 }))
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
    res.json({
        status: "success",
        message: "server is working"
    })
})

app.use("/api/auth", authRouter)

app.use("/api/todos", todoRouter)

const PORT = process.env.PORT || "8080"

app.listen(PORT, async () => {
    console.log(`server is running on port ${PORT}`)
})