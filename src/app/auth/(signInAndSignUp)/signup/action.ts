"use server"

import { prisma } from "@/utils/database"
import { FormProps } from "./components/form"
import { getDate } from "@/utils/moment"
import { genSalt, hash } from "bcrypt"

export const post = async (formData: FormData) => {
    try{
        const { name, email, password } = Object.fromEntries(formData) as FormProps
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if(user){
            return {
                name: "FORM_VALIDATION_ERROR",
                errors: {
                    email: "Email sudah terdaftar!"
                }
            }
        }

        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "CUSTOMER",
                createdAt: getDate()
            }
        })

        return {
            name: "SUCCESS"
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}