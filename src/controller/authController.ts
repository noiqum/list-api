import express from "express"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendError, sendSuccess } from "../utils/responseUtils";
import prisma from "../config/prismaClient";
import { Prisma } from "@prisma/client";

const include = {
    todos: true
} satisfies Prisma.UserInclude

export const register = async (req: express.Request, res: express.Response) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        sendError(res, "name , email and password is required", 400)
    }

    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (user) {
        sendError(res, `${email} alredy in use`, 409)
    } else {
        const securedPassword = await bcrypt.hash(password, 10)
        try {
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: securedPassword
                }
            })
            if (newUser) {
                const token = jwt.sign({ userId: newUser.id, email: newUser.email, name: newUser.name }, process.env.JWT_SECRET!, {
                    expiresIn: '1d',
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: process.env.Node_ENV === "production",
                    maxAge: 24 * 60 * 60 * 1000
                })
                const userData = { name: newUser.name, email: newUser.email, id: newUser.id, token: token }
                sendSuccess(res, userData, "new user is registered", 201)
            }

        } catch (error) {
            sendError(res, "something went wrong", 500)
        }
    }

}


export const login = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        sendError(res, "email and password is required", 400)
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email as string
        }
    })
    if (!user) {
        sendError(res, `${email} , no such a user `, 400)
    } else {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            sendError(res, "invalid password", 409)
        } else {
            const token = jwt.sign({
                name: user.name, id: user.id, email: user.email
            }, process.env.JWT_SECRET!, { expiresIn: "1d" })
            res.cookie("token", token)
            const { password, ...rest } = user
            const passwordOmittedUser = { ...rest, token }
            sendSuccess(res, passwordOmittedUser, "user logged in", 200)
        }
    }
}

export const logout = (req: express.Request, res: express.Response) => {
    res.clearCookie("token")
    sendSuccess(res, {}, "user logged out", 201)
}