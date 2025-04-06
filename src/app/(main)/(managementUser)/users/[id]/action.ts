"use server"

import cloudinary from "@/utils/cloudinary"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { genSalt, hash } from "bcrypt"
import { UploadApiResponse } from "cloudinary"
import { revalidatePath } from "next/cache"
import { FormValues } from "./components/form"

export type GetPayload = Prisma.UserGetPayload<{
    select: {
        id: true,
        photo: true,
        name: true,
        email: true,
        telp: true,
        address: true,
    }
}>

export const GET = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                photo: true,
                name: true,
                email: true,
                telp: true,
                address: true,
            }
        })

        if (user === null) {
            return {
                name: "USER_NOT_FOUND",
                message: "Pengguna tidak ditemukan!"
            }
        }

        return {
            name: "SUCCESS",
            data: user
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export const UPDATE = async (id: string, formData: FormData) => {
    try {
        const { name, address, email, password, photo, telp } = Object.fromEntries(formData) as FormValues
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (user) {
            if (user.email != email) {
                return {
                    name: "FORM_VALIDATION",
                    errors: {
                        email: "Email sudah terdaftar!"
                    }
                }
            }
        }

        let uploadResult: UploadApiResponse | undefined = undefined;
        if (photo) {
            if(user!.photo){
                await cloudinary.v2.api.delete_resources([user!.photo], {
                    type: "upload",
                    resource_type: "image"
                })
            }

            const result = await cloudinary.v2.uploader.upload(photo as unknown as string, {
                folder: "users",
                resource_type: "image",
            })

            uploadResult = result
        }

        let hashPassword: string | undefined = undefined
        if (password != "") {
            const salt = await genSalt(10)
            hashPassword = await hash(password, salt)
        }
        await prisma.user.update({
            data: {
                name,
                email,
                password: hashPassword,
                address,
                telp,
                photo: uploadResult ? uploadResult.public_id : undefined,
                role: "RECIPIENT",
                createdAt: getDate()
            },
            where: { id }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            messsage: "Ada kesalahan pada server!"
        }
    }
}