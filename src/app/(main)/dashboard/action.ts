"use server"

import { prisma } from "@/utils/database"
import xenditClient from "@/utils/xendit"

export const GET = async () => {
    try{
        const [ room, roomCategory, user, balance ] = await Promise.all([
            await prisma.room.count(),
            await prisma.roomCategory.count(),
            await prisma.user.count({
                where: {
                    deletedAt: null,
                    role: "RECIPIENT"
                }
            }),
            xenditClient.Balance.getBalance({currency: "IDR"})
        ])

        console.log(balance)
        return {
            name: "SUCCESS",
            data: {
                room,
                roomCategory,
                user,
                balance
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