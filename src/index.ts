import express, { Request, Response } from "express";
import authRouter from "./routes/authRoutes"
const app = express()
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.json({
        status: "success",
        message: "server is working"
    })
})
app.use("/api/auth", authRouter)
const PORT = process.env.PORT || "8080"
app.listen(PORT, async () => {
    console.log(`server is running on port ${PORT}`)
})