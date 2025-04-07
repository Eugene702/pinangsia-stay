"use server"

import cloudinary from "@/utils/cloudinary"
import { prisma } from "@/utils/database"
import { Prisma } from "@prisma/client"
import { UploadApiResponse } from "cloudinary"
import { revalidatePath } from "next/cache"

export type GetPayload = Prisma.RoomCategoryGetPayload<{
    select: {
        id: true,
        name: true,
        photo: true,
        price: true
    }
}>

export const GET = async (id: string) => {
    try {
        const roomCategory = await prisma.roomCategory.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                photo: true,
                price: true
            }
        })

        if (!roomCategory) return {
            name: "NOT_FOUND",
            message: "Kategori tidak ditemukan!",
        }

        return {
            name: "SUCCESS",
            data: roomCategory
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!",
        }
    }
}

export const PATCH = async (id: string, formData: FormData) => {
    try {
        const { photo, name, price } = Object.fromEntries(formData)
        let uploadResult: UploadApiResponse | undefined = undefined
        if(photo){
            const roomCategory = await prisma.roomCategory.findUnique({
                where: { id },
                select: {
                    photo: true
                }
            })

            await cloudinary.v2.api.delete_resources([roomCategory!.photo], {
                resource_type: "image",
                type: "upload"
            })

            uploadResult = await cloudinary.v2.uploader.upload(photo as string, {
                folder: "room-management/category",
                resource_type: "image"
            })
        }

        await prisma.roomCategory.update({
            where: { id },
            data: {
                name: name as string,
                price: Number(price),
                photo: uploadResult ? uploadResult.public_id : undefined,
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Kategori berhasil ditambahkan!",
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!",
        }
    }
}