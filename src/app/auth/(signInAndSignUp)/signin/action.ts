"use server"

import { prisma } from "@/utils/database"
import { FormProps } from "./components/form"
import { compare } from "bcrypt"

export const post = async (formData: FormData) => {
    try{
        const { email, password } = Object.fromEntries(formData) as FormProps
        const user = await prisma.user.findUnique({
            select: {
                id: true,
                password: true,
                name: true,
                photo: true,
                role: true
            },
            where: { email }
        })

        if(!user){
            return {
                name: "FORM_VALIDATION",
                errors: {
                    email: "Pengguna tidak ditemukan!"
                }
            }
        }

        const isPasswordValid = await compare(password, user.password)
        if(!isPasswordValid){
            return {
                name: "FORM_VALIDATION",
                errors: {
                    password: "Kata sandi tidak sesuai!"
                }
            }
        }

        return {
            name: "SUCCESS",
            data: {
                id: user.id,
                name: user.name,
                email: email,
                photo: user.photo,
                role: user.role
            }
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Terjadi kesalahan pada server!"
        }
    }
}