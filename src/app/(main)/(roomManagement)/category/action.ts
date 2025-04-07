"use server"

import { SearchParams } from "@/types/global"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { pagination } from "prisma-extension-pagination"
import { PageNumberPagination } from "prisma-extension-pagination/dist/types"

export type GetPayload = [
    Prisma.RoomCategoryGetPayload<{
        select: {
            id: true,
            photo: true,
            name: true,
            price: true
        },
    }>[],
    PageNumberPagination
]

export const GET = async ({ searchParams }: { searchParams: SearchParams }) => {
    try {
        const roomCategory = await prisma.$extends(pagination()).roomCategory.paginate({
            select: {
                id: true,
                photo: true,
                name: true,
                price: true
            },
            where: {
                deletedAt: null,
                OR: [
                    {
                        name: {
                            contains: searchParams.search ?? "",
                            mode: "insensitive"
                        },
                    },
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        })
            .withPages({
                limit: 10,
                page: searchParams.page ? parseInt(searchParams.page || "1") : 1,
            })

        return {
            name: "SUCCESS",
            data: roomCategory
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Terjadi kesalahan pada server!"
        }
    }
}

export const DELETE = async (id: string) => {
    try{
        const roomCategory = await prisma.roomCategory.findUnique({
            where: { id }
        })

        if(!roomCategory) return {
            name: "NOT_FOUND",
            message: "Kategori kamar tidak ditemukan!"
        }

        await prisma.roomCategory.update({
            where: { id },
            data: {
                deletedAt: getDate()
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Berhasil menghapus kategori kamar!"
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Terjadi kesalahan pada server!"
        }
    }
}