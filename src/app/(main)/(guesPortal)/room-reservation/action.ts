"use server"

import { prisma } from "@/utils/database"

export const GET = async () => {
    try{
        const roomCategory = await prisma.roomCategory.findMany({
            where: { deletedAt: null },
            select: {
                id: true,
                name: true,
                photo: true,
                price: true
            },
            orderBy: {
                name: "asc"
            }
        })

        return {
            name: "SUCCESS",
            data: roomCategory
        }
    }catch(e){
        console.error(e)
        return {
            "name": "SERVER_ERROR",
            "message": "Ada kesalahan pada server!"
        }
    }
}