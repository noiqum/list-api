import { Router } from "express"
import { register, login, logout } from "../controller/authController"
import { validateMiddleware } from "../middleware/validateMiddleware"
import { loginSchema, registerSchema } from "../schema/authSchema"
const router = Router()

router.post("/register", validateMiddleware(registerSchema), register)
router.post("/login", validateMiddleware(loginSchema), login)
router.post("/logout", logout)

export default router;
