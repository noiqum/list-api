import { Router, Request, } from "express"
import { create, deleteTodo, getAllTodosByUserId, update } from "../controller/todoController"
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryV2 from "../config/cloudinary";
import { authMiddleware } from "../middleware/authMiddleware";

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryV2
})
function fileFilter(req: any, file: any, cb: any) {

    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/svg" || file.mimetype === "application/pdf") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const fileUploadMiddleware = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 5 } })

const router = Router()

router.get("/", authMiddleware(), getAllTodosByUserId)
router.post("/", authMiddleware(), fileUploadMiddleware.fields([{ name: "image", maxCount: 1 }, { name: "file", maxCount: 1 }]), create)
router.delete("/:id", authMiddleware(), deleteTodo)
router.put("/:id", authMiddleware(), fileUploadMiddleware.fields([{ name: "image", maxCount: 1 }, { name: "file", maxCount: 1 }]), update)



export default router