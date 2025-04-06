"use server"

import { SearchParams } from "@/types/global"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { pagination } from "prisma-extension-pagination"

export type GetPayload = Prisma.UserGetPayload<{
    select: {
        id: true,
        photo: true,
        name: true,
        email: true,
        telp: true,
        address: true,
        role: true,
    }
}>
export const get = async ({ searchParams }: { searchParams: SearchParams }) => {
    try {
        const user = await prisma.$extends(pagination()).user.paginate({
            where: {
                deletedAt: null,
                OR: [
                    {
                        name: {
                            contains: searchParams.search ?? "",
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: searchParams.search ?? "",
                            mode: "insensitive"
                        }
                    },
                    {
                        telp: {
                            contains: searchParams.search ?? "",
                            mode: "insensitive"
                        }
                    }
                ]
            },
            select: {
                id: true,
                photo: true,
                name: true,
                email: true,
                telp: true,
                address: true,
                role: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        }).withPages({
            limit: 10,
            page: searchParams.page ? parseInt(searchParams.page || "1") : 1,
        })

        return {
            name: "SUCCESS",
            data: user
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
        const user = await prisma.user.findUnique({
            where: { id }
        })

        if(user == null){
            return {
                name: "NOT_FOUND",
                message: "Pengguna tidak ditemukan!"
            }
        }

        await prisma.user.update({
            where: { id },
            data: {
                deletedAt: getDate()
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Pengguna berhasil dihapus!"
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Terjadi kesalahan pada server!"
        }
    }
}