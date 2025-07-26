"use server"

import cloudinary from "@/utils/cloudinary"
import { prisma } from "@/utils/database"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { EditFormBiodataType } from "./components/editBiodata"
import { EditPasswordFormType } from "./components/editPassword"
import { genSalt, hash } from "bcrypt"

export type GetResponseType = Prisma.UserGetPayload<{
    select: {
        address: true,
        email: true,
        name: true,
        photo: true,
        role: true,
        telp: true,
        id: true,
        password: true,
        createdAt: true,
    }
}>
export const GET = async () => {
    try{
        const session = await getServerSession()
        if(session == null || session.user == null){
            return {
                name: "UNAUTHORIZED",
                message: "Anda tidak memiliki akses!"
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email!,
                role: session.user.role
            }
        })

        if(user == null){
            return {
                name: "UNAUTHORIZED",
                message: "Anda tidak memiliki akses!"
            }
        }

        return {
            name: "SUCCESS",
            data: user
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export const PostPhoto = async (file: string) => {
    try{
        const session = await getServerSession()
        if(session == null || session.user === null){
            return {
                name: "UNAUTHORIZED",
                message: "Anda tidak memiliki akses!"
            }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { photo: true }
        })

        if(user == null){
            return {
                name: "UNAUTHORIZED",
                message: "Anda tidak memiliki akses!"
            }
        }

        if(user.photo != null){
            await cloudinary.v2.uploader.destroy(user.photo, {
                resource_type: "image",
            })
        }

        const { public_id } = await cloudinary.v2.uploader.upload(file, {
            folder: `/users/`,
        })

        await prisma.user.update({
            where: { email: session.user.email! },
            data: {
                photo: public_id
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Foto profil berhasil diubah!"
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export const StoreBiodata = async ({ address, email, name, telp }: EditFormBiodataType) => {
    try{
        const session = await getServerSession()
        if(session == null || session.user === null){
            return {
                name: "UNAUTHORIZED",
                message: "Anda tidak memiliki akses!"
            }
        }

        if(session.user.email !== email){
            const user = await prisma.user.findUnique({
                where: { email }
            })

            if(user != null){
                return {
                    name: "ERRORS",
                    error: {
                        email: "Email sudah terdaftar!"
                    }
                }
            }
        }

        await prisma.user.update({
            where: { email: session.user.email! },
            data: { email, name, telp: telp.toString(), address }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Biodata berhasil diubah!"
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export const PatchPassword = async ({ password }: EditPasswordFormType) => {
    try{
        const session = await getServerSession()
        if(session == null || session.user === null){
            return {
                name: "UNAUTHORIZED",
                message: "Anda tidak memiliki akses!"
            }
        }

        const salt = await genSalt(10)
        const hashPassword = await hash(password, salt)
        await prisma.user.update({
            where: { email: session.user.email! },
            data: { password: hashPassword }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Kata sandi berhasil diubah!"
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}