"use server"

import { prisma } from "@/utils/database"

export const GET = async () => {
    try{
        const [ room, roomCategory, user ] = await Promise.all([
            await prisma.room.count(),
            await prisma.roomCategory.count(),
            await prisma.user.count({
                where: {
                    deletedAt: null,
                    role: "RECIPIENT"
                }
            })
        ])

        return {
            name: "SUCCESS",
            data: {
                room,
                roomCategory,
                user
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