"use server"

import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export type GetResponseType = Prisma.RoomCategoryGetPayload<{
    select: {
        id: true
        name: true
    }
}>[]

export const GET = async () => {
    try{
        const roomCateggory = await prisma.roomCategory.findMany({
            where: {
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc"
            }
        })

        return {
            name: "SUCCESS",
            data: roomCateggory
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export const STORE = async (formData: FormData) => {
    try{
        const { no, categoryId, floor } = Object.fromEntries(formData)
        const room = await prisma.room.findUnique({
            where: { no: no as string }
        })

        if(room){
            return {
                name: "SET_ERROR",
                errors: {
                    no: "Nomor kamar sudah terdaftar!"
                }
            }
        }

        await prisma.room.create({
            data: {
                no: no as string,
                roomCategoryId: categoryId as string,
                floor: Number(floor),
                createdAt: getDate()
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Kamar berhasil ditambahkan!",
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}