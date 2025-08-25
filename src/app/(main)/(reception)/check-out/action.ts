"use server"

import { SearchParams } from "@/types/global"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { pagination } from "prisma-extension-pagination"
import { PageNumberPagination } from "prisma-extension-pagination/dist/types"

export type GetResponseType = {
    roomAllocation: Prisma.RoomAllocationGetPayload<{
        select: {
            id: true,
            booking: {
                select: {
                    id: true,
                    checkInDate: true,
                    checkOutDate: true,
                    bookingTime: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            photo: true,
                        }
                    },
                    roomCategory: {
                        select: {
                            name: true,
                            price: true
                        }
                    }
                }
            },
            room: {
                select: {
                    no: true,
                    roomCategory: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            checkIn: true,
        },
    }>[],
    pagination: PageNumberPagination
}

export const GET = async ({ searchParams }: { searchParams: SearchParams }) => {
    try {
        const roomAllocation = await prisma.$extends(pagination()).roomAllocation.paginate({
            where: {
                checkOut: null,
                OR: [
                    {
                        booking: {
                            user: {
                                name: {
                                    contains: searchParams.search ?? "",
                                    mode: "insensitive"
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                booking: {
                    select: {
                        id: true,
                        checkInDate: true,
                        checkOutDate: true,
                        bookingTime: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                photo: true,
                            }
                        },
                        roomCategory: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                },
                room: {
                    select: {
                        no: true,
                        roomCategory: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                checkIn: true,
            },
            orderBy: {
                checkIn: "desc"
            }
        }).withPages({
            page: "page" in searchParams ? parseInt(searchParams.page || "1") : 1,
            limit: 10
        })

        return {
            name: "SUCCESS",
            data: {
                roomAllocation: roomAllocation[0],
                pagination: roomAllocation[1]
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

export const PATCH = async (id: string) => {
    try{
        await prisma.roomAllocation.update({
            where: { id },
            data: {
                checkOut: getDate()
            }
        })

        revalidatePath("/", "layout")
        return {
            name: "SUCCESS",
            message: "Berhasil check out tamu!"	
        }
    }catch(e){
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}