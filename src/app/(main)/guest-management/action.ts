"use server"

import { SearchParams } from "@/types/global"
import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { pagination } from "prisma-extension-pagination"
import { PageNumberPagination } from "prisma-extension-pagination/dist/types"

export type PendingCheckInType = {
    bookings: Prisma.BookingGetPayload<{
        select: {
            id: true,
            user: {
                select: {
                    photo: true,
                    name: true,
                    email: true,
                    telp: true
                }
            },
            roomCategory: {
                select: {
                    id: true,
                    name: true,
                    price: true
                }
            },
            bookingTime: true,
            paidOff: true
        },
    }>[],
    pagination: PageNumberPagination
}

export type CurrentGuestsType = {
    allocations: Prisma.RoomAllocationGetPayload<{
        select: {
            id: true,
            checkIn: true,
            booking: {
                select: {
                    id: true,
                    user: {
                        select: {
                            photo: true,
                            name: true,
                            email: true,
                            telp: true
                        }
                    },
                    roomCategory: {
                        select: {
                            name: true,
                            price: true
                        }
                    },
                    bookingTime: true,
                    paidOff: true
                }
            },
            room: {
                select: {
                    no: true,
                    floor: true
                }
            }
        },
    }>[],
    pagination: PageNumberPagination
}

export const GET_PENDING_CHECKIN = async ({ searchParams }: { searchParams: SearchParams }) => {
    try {
        const today = getDate({ fromMidnight: true })
        const todayEnd = new Date(today)
        todayEnd.setHours(23, 59, 59, 999) // End of today
        
        const fiveDaysAgo = new Date(today)
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
        
        const bookings = await prisma.$extends(pagination()).booking.paginate({
            where: {
                NOT: {
                    paidOff: null,
                },
                roomAllocation: null,
                AND: [
                    // Date filter: today OR expired 1-5 days
                    {
                        OR: [
                            // Booking untuk hari ini (bisa check-in)
                            {
                                bookingTime: {
                                    gte: today,
                                    lte: todayEnd
                                }
                            },
                            // Booking expired 1-5 hari (tidak bisa check-in, tapi tetap tampil)
                            {
                                bookingTime: {
                                    gte: fiveDaysAgo,
                                    lt: today
                                }
                            }
                        ]
                    },
                    // Search filter
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
                        email: true,
                        telp: true
                    }
                },
                roomCategory: {
                    select: {
                        id: true,
                        name: true,
                        price: true
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
            name: "SUCCESS" as const,
            data: {
                bookings: bookings[0],
                pagination: bookings[1]
            }
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR" as const,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const GET_CURRENT_GUESTS = async ({ searchParams }: { searchParams: SearchParams }) => {
    try {
        const allocations = await prisma.$extends(pagination()).roomAllocation.paginate({
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
                    },
                    {
                        room: {
                            no: {
                                contains: searchParams.search ?? "",
                                mode: "insensitive"
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                checkIn: true,
                booking: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                photo: true,
                                name: true,
                                email: true,
                                telp: true
                            }
                        },
                        roomCategory: {
                            select: {
                                name: true,
                                price: true
                            }
                        },
                        bookingTime: true,
                        paidOff: true
                    }
                },
                room: {
                    select: {
                        no: true,
                        floor: true
                    }
                }
            },
            orderBy: {
                checkIn: "desc"
            }
        }).withPages({
            limit: 10,
            page: searchParams.page != undefined ? parseInt(searchParams.page as string) : 1
        })

        return {
            name: "SUCCESS" as const,
            data: {
                allocations: allocations[0],
                pagination: allocations[1]
            }
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR" as const,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const CHECK_IN = async (bookingData: PendingCheckInType['bookings'][number]) => {
    try {
        const room = await prisma.room.findFirst({
            where: {
                roomCategory: {
                    id: bookingData.roomCategory.id
                },
                roomAvailability: null,
                deletedAt: null
            },
            select: {
                no: true
            }
        })

        if (!room) {
            return {
                name: "NOT_FOUND" as const,
                message: "Tidak ada kamar yang tersedia!"
            }
        }

        const roomAllocation = await prisma.roomAllocation.create({
            data: {
                bookingId: bookingData.id,
                roomId: room.no,
                checkIn: getDate(),
                roomAvailability: {
                    create: {
                        roomId: room.no
                    }
                }
            }
        })

        revalidatePath("/guest-management", "page")
        return {
            name: "SUCCESS" as const,
            data: roomAllocation
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR" as const,
            message: "Ada kesalahan pada server!"
        }
    }
}

export const CHECK_OUT = async (allocationData: CurrentGuestsType['allocations'][number]) => {
    try {
        await prisma.roomAllocation.update({
            where: {
                id: allocationData.id
            },
            data: {
                checkOut: getDate()
            }
        })

        await prisma.roomAvailability.delete({
            where: {
                roomId: allocationData.room.no
            }
        })

        revalidatePath("/guest-management", "page")
        return {
            name: "SUCCESS" as const,
            message: "Tamu berhasil check-out!"
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR" as const,
            message: "Ada kesalahan pada server!"
        }
    }
}
