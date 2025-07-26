"use server"

import { SearchParams } from "@/types/global"
import { prisma } from "@/utils/database"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { pagination } from "prisma-extension-pagination"
import { PageNumberPagination } from "prisma-extension-pagination/dist/types"

export type GetResponseType = {
    booking: Prisma.BookingGetPayload<{
        select: {
            id: true,
            paidOff: true,
            roomCategory: {
                select: {
                    name: true
                }
            },
            bookingTime: true,
            roomAllocation: {
                select: {
                    checkIn: true,
                    checkOut: true,
                    roomId: true,
                    room: {
                        select: {
                            no: true
                        }
                    }
                }
            }
        }
    }>[],
    pagination: PageNumberPagination
}

export const GET = async ({ searchParams }: { searchParams: SearchParams }) => {
    try {
        const session = await getServerSession()
        if (!session || !session.user || !session.user.email) {
            return {
                name: "UNAUTHORIZED",
                message: "Anda tidak memiliki akses untuk melakukan ini!"
            }
        }

        const booking = await prisma.$extends(pagination()).booking.paginate({
            where: {
                NOT: {
                    paidOff: null
                },
                user: {
                    email: session.user.email
                }
            },
            select: {
                id: true,
                paidOff: true,
                roomCategory: {
                    select: {
                        name: true
                    }
                },
                bookingTime: true,
                roomAllocation: {
                    select: {
                        checkIn: true,
                        checkOut: true,
                        roomId: true,
                        room: {
                            select: {
                                no: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
        }).withPages({
            limit: 10,
            page: "page" in searchParams ? parseInt(searchParams.page as string) : 1
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
            message: "Terjadi kesalahan pada server!"
        }
    }
}