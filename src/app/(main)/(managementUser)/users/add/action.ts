"use server"

import { prisma } from "@/utils/database"
import { FormValues } from "./components/form"
import { genSalt, hash } from "bcrypt"
import cloudinary from "@/utils/cloudinary"
import { UploadApiResponse } from "cloudinary"
import { getDate } from "@/utils/moment"
import { revalidatePath } from "next/cache"

export const post = async (formData: FormData) => {
    try {
        const { name, address, email, password, photo, telp } = Object.fromEntries(formData) as FormValues
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (user) {
            return {
                name: "FORM_VALIDATION",
                errors: {
                    email: "Email sudah terdaftar!"
                }
            }
        }

        let uploadResult: UploadApiResponse | undefined = undefined;
        if (photo) {
            const result = await cloudinary.v2.uploader.upload(photo as unknown as string, {
                folder: "users",
                resource_type: "image",
            })

            uploadResult = result
        }

        const salt = await genSalt(10)
        const hashPassword = await hash(password, salt)
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                address,
                telp,
                photo: uploadResult ? uploadResult.public_id : undefined,
                role: "RECIPIENT",
                createdAt: getDate()
            }
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