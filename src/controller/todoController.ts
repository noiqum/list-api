import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import { sendError, sendPaginatedSuccess, sendSuccess } from "../utils/responseUtils";
import getAIreply from "../config/gemini";
import { Prisma, PrismaClient } from "@prisma/client";


export const handleRequestFiles = (req: Request) => {
    let imageFile = null
    let document = null

    if (req.files) {
        if ((req.files as any).image) {
            const { originalname, mimetype, path } = (req as any).files.image[0]
            imageFile = {
                name: originalname,
                filetype: mimetype,
                url: path
            }
        }
        if ((req.files as any).file) {
            const { originalname, mimetype, path } = (req as any).files.file[0]
            document = {
                name: originalname,
                filetype: mimetype,
                url: path
            }
        }
    }

    return {
        imageFile,
        document
    }
}


export const getAllTodosByUserId = async (req: Request, res: Response) => {
    const user = req.user
    const page = parseInt(req.params.page) || 1
    const limit = parseInt(req.params.limit) || 10

    try {
        const data = await prisma.todo.findMany({
            where: {
                userId: user.id
            },
            skip: (page - 1) * limit,
            take: 10,
            select: {
                advice: true
            }
        })
        const totalTodoCount = await prisma.todo.count({
            where: {
                userId: user.id
            }
        })
        sendPaginatedSuccess(res, data, totalTodoCount, page, limit)
    } catch (error) {
        console.log(error),
            sendError(res, "something went wrong", 500)
    }
}

export const getTodoByID = async (req: Request, res: Response) => {
    const todoID = req.params.id
    const user = req.user
    try {
        const todo = await prisma.todo.findUnique({
            where: {
                id: todoID
            }
        })
        if (todo?.userId !== user.id) {
            sendError(res, "Access Denied. No permission", 403)
            return
        }
        sendSuccess(res, todo, "todo", 200)
    } catch (error) {
        console.log(error)
        sendError(res, "something went wrong", 500)
    }
}
export const create = async (req: Request, res: Response) => {

    try {
        const userId = req.body.userId;
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if (!user) {
            sendError(res, "user could not find", 401)
            return
        } else if (user.id !== req.user.id) {
            sendError(res, "Access Denied, No permission", 403)
            return
        } else {
            const dueDate = new Date(req.body.dueDate)
            const { imageFile, document } = handleRequestFiles(req)
            const advices = await getAIreply(req.body.content as string)
            const record = await prisma.todo.create({
                data: {
                    userId: userId as string,
                    content: req.body.content as string,
                    dueDate,
                    completed: req.body.completed === "false" ? false : true,
                    image: imageFile || null,
                    file: document || null,
                    advice: advices as string ?? ""
                }
            })

            if (record) {
                sendSuccess(res, record, "todo added", 200)
            } else {
                sendError(res, "a problem occurred while todo added", 500)
            }

        }

    } catch (error) {
        console.log(error)
        sendError(res, "something went wrong", 500)
    }
}

export const deleteTodo = async (req: Request, res: Response) => {

    const id = req.params.id as string
    const user = req.user


    try {
        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        })
        if (!todo) {
            sendError(res, "todo could not find", 500)
            return
        }
        if (todo?.userId !== user.id) {
            sendError(res, "No permission", 403)
            return
        }

        const deletedTodo = await prisma.todo.delete({
            where: {
                id: todo?.id
            }
        })
        sendSuccess(res, deletedTodo, "todo deleted", 200)

    } catch (error) {
        console.log(error)
        sendError(res, "something went wrong", 500)
    }
}

export const update = async (req: Request, res: Response) => {

    const todoId = req.params.id as string
    const data = req.body
    const user = req.user
    try {
        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId
            }
        })
        if (todo?.userId !== user.id) {
            sendError(res, "No permission", 403)
            return
        }
        const { imageFile, document } = handleRequestFiles(req)
        if (imageFile) {
            data.image = imageFile
        }
        if (document) {
            data.file = document
        }
        if (data.content) {
            const advices = await getAIreply(data.content)
            data.advice = advices
        }
        const updatedTodo = await prisma.todo.update({
            where: {
                id: todoId
            },
            data: {
                ...data
            }
        })
        sendSuccess(res, updatedTodo, "todo updated", 200)
    } catch (error) {
        console.log(error)
        sendError(res, "something went wrong", 500)
    }



}