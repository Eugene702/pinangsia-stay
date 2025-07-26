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
                // images: true, // TODO: Enable after Prisma client regeneration
                price: true,
                description: true,
                detail: {
                    select: {
                        description: true,
                        facilities: true,
                        amenities: true,
                        roomSize: true,
                        maxOccupancy: true,
                        bedType: true,
                        viewType: true,
                        policies: true
                    }
                }
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