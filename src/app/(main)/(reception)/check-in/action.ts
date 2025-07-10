"use server"

import { SearchParams } from "@/types/global"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { pagination } from "prisma-extension-pagination"
import { PageNumberPagination } from "prisma-extension-pagination/dist/types"

export type GetResponseType = {
    booking: Prisma.BookingGetPayload<{
        select: {
            id: true,
            user: {
                select: {
                    photo: true,
                    name: true,
                }
            },
            roomCategory: {
                select: {
                    id: true,
                    name: true
                }
            },
            bookingTime: true,
            paidOff: true
        },
    }>[],
    pagination: PageNumberPagination
}

export const GET = async ({ searchParams }: { searchParams: SearchParams }) => {
    try {
        const booking = await prisma.$extends(pagination()).booking.paginate({
            where: {
                NOT: {
                    paidOff: null,
                },
                roomAllocation:null,
                bookingTime: {
                    gte: getDate({ fromMidnight: true }),
                    lte: getDate({ fromMidnight: true })
                },
                OR: [
                    {
                        user: {
                            name: {
                                contains: searchParams.search ?? "",
                                mode: "insensitive"
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                user: {
                    select: {
                        photo: true,
                        name: true,
                    }
                },
                roomCategory: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                bookingTime: true,
                paidOff: true
            },
            orderBy: {
                bookingTime: "desc"
            }
        }).withPages({
            limit: 10,
            page: searchParams.page != undefined ? parseInt(searchParams.page as string) : 1
        })

        return {
            name: "SUCCESS",
            data: {
                booking: booking[0],
                pagination: booking[1]
            }
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export const STORE = async (data: GetResponseType['booking'][number]) => {
    try{
        const room = await prisma.room.findFirst({
            where: {
                roomCategory: {
                    id: data.roomCategory.id
                },
                roomAvailability: null,
                deletedAt: null
            },
            select: {
                no: true
            }
        })

        if(!room){
            return {
                name: "NOT_FOUND",
                message: "Tidak ada kamar yang tersedia!"
            }
        }

        const roomAllocation = await prisma.roomAllocation.create({
            data: {
                bookingId: data.id,
                roomId: room.no,
                checkIn: getDate(),
                roomAvailability: {
                    create: {
                        roomId: room.no
                    }
                }
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            data: roomAllocation
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}