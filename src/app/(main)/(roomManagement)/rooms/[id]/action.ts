"use server"

import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

export type GetResponseType = {
    room: Prisma.RoomGetPayload<{}>
    roomCategory: Prisma.RoomCategoryGetPayload<{
        select: {
            id: true
            name: true
        }
    }>[]
}

export const GET = async (no: string) => {
    try {
        const [room, roomCategory] = await Promise.all([
            await prisma.room.findUnique({
                where: { no },
            }),

            await prisma.roomCategory.findMany({
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
        ])

        if (!room) {
            return {
                name: "NOT_FOUND",
                message: "Kamar tidak ditemukan!"
            }
        }

        return {
            name: "SUCCESS",
            data: { room, roomCategory }
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export const PATCH = async (formData: FormData) => {
    try {
        const { no, oldNo, categoryId, floor } = Object.fromEntries(formData)
        if (no !== oldNo) {
            const room = await prisma.room.findUnique({
                where: {
                    no: no as string,
                },
            })

            if (room) {
                return {
                    name: "SET_ERROR",
                    errors: {
                        no: "Nomor kamar sudah terdaftar!",
                    },
                }
            }
        }

        await prisma.room.update({
            where: { no: oldNo as string },
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
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}