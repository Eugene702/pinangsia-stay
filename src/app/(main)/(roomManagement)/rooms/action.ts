"use server"

import { SearchParams } from "@/types/global"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { pagination } from "prisma-extension-pagination"
import { PageNumberPagination } from "prisma-extension-pagination/dist/types"

export type GetResponseType = {
    room: Prisma.RoomGetPayload<{
        select: {
            no: true,
            roomCategory: {
                select: {
                    name: true,
                    price: true,
                    photo: true
                }
            },
            floor: true,
            createdAt: true,
            roomAvailability: {
                select: {
                    roomId: true
                }
            }
        }
    }>[],
    pagination: PageNumberPagination
}
export const GET = async (searchParams: SearchParams) => {
    try{
        const room = await prisma.$extends(pagination()).room.paginate({
            where: {
                deletedAt: null,
                OR: [
                    {
                        roomCategory: {
                            name: {
                                contains: searchParams.search ?? "",
                                mode: "insensitive"
                            }
                        }
                    }
                ]
            },
            select: {
                no: true,
                roomCategory: {
                    select: {
                        name: true,
                        price: true,
                        photo: true
                    }
                },
                floor: true,
                createdAt: true,
                roomAvailability: {
                    select: {
                        roomId: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        }).withPages({
            limit: 10,
            page: "page" in searchParams ? parseInt(searchParams.page || "1") : 1
        })

        return {
            name: "SUCCESS",
            data: {
                room: room[0],
                pagination: room[1]
            }
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export const DELETE = async (no: string) => {
    try{
        await prisma.room.update({
            where: { no },
            data: {
                deletedAt: getDate()
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Berhasil menghapus kamar!"
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}