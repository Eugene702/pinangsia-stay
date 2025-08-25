"use server"

import { SearchParams } from "@/types/global"
import { prisma } from "@/utils/database"
import { Prisma } from "@prisma/client"
import { pagination } from "prisma-extension-pagination"
import { PageNumberPagination } from "prisma-extension-pagination/dist/types"

export type GetResponseType = {
    booking: Prisma.BookingGetPayload<{
        select: {
            id: true,
            checkInDate: true,
            checkOutDate: true,
            bookingTime: true,
            paidOff: true,
            createdAt: true,
            roomCategory: {
                select: {
                    name: true,
                    price: true
                }
            },
            user: {
                select: {
                    name: true,
                    email: true,
                    telp: true
                }
            },
            roomAllocation: {
                select: {
                    id: true,
                    checkIn: true,
                    checkOut: true,
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
        const booking = await prisma.$extends(pagination()).booking.paginate({
            where: {
                NOT: {
                    paidOff: null
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
                checkInDate: true,
                checkOutDate: true,
                bookingTime: true,
                paidOff: true,
                createdAt: true,
                roomCategory: {
                    select: {
                        name: true,
                        price: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        telp: true
                    }
                },
                roomAllocation: {
                    select: {
                        id: true,
                        checkIn: true,
                        checkOut: true,
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
            }
        }).withPages({
            limit: 10,
            page: "page" in searchParams ? parseInt(searchParams.page || "1") : 1
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