"use server"

import cloudinary from "@/utils/cloudinary"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { revalidatePath } from "next/cache"

export const POST = async (formData: FormData) => {
    try{
        const { photo, name, price } = Object.fromEntries(formData)

        const result = await cloudinary.v2.uploader.upload(photo as string, {
            folder: "room-management/category",
            resource_type: "image"
        })

        await prisma.roomCategory.create({
            data: {
                name: name as string,
                price: Number(price),
                photo: result.public_id,
                createdAt: getDate()
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Kategori berhasil ditambahkan!",
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Terjadi kesalahan pada server!",
        }
    }
}