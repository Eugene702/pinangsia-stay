import { prisma } from "@/utils/database"

// Type definitions
export interface ReportSearchParams {
    startDate?: string
    endDate?: string
    roomId?: string
    status?: string
}

export interface BookingData {
    id: string
    roomCategoryId: string
    userId: string
    bookingTime: Date
    paidOff: Date | null
    createdAt: Date
    roomCategory: {
        name: string
        price: bigint
    }
    user: {
        name: string
        email: string
    }
    roomAllocation: {
        checkIn: Date
        checkOut: Date | null
        room: {
            no: string
        }
    } | null
    transaction: {
        transactionId: string
        transactionMethodId: string
    } | null
}

export interface ReportSummary {
    totalBookings: number
    totalRevenue: number
    activeBookings: number
    completedBookings: number
}

export interface RoomOccupancy {
    id: string
    name: string
    category: string
    floor: number
    isOccupied: boolean
    currentGuest: string | null
}

export interface ReportResponse {
    name: "SUCCESS" | "CONNECTION_POOL_ERROR" | "TIMEOUT_ERROR" | "DATABASE_ERROR"
    message?: string
    data?: {
        bookings: BookingData[]
        summary: ReportSummary
        roomOccupancy: RoomOccupancy[]
    }
}

// Alias untuk backward compatibility
export type GetResponseType = ReportResponse

export async function GET({ searchParams }: { searchParams: ReportSearchParams }): Promise<ReportResponse> {
    try {
        const { startDate, endDate, roomId } = searchParams

        // Build date filters
        const dateFilter: any = {}
        if (startDate) {
            dateFilter.gte = new Date(startDate)
        }
        if (endDate) {
            dateFilter.lte = new Date(endDate)
        }

        // Race condition untuk prevent timeout
        const queryPromise = Promise.all([
            // Get bookings dengan filter
            prisma.booking.findMany({
                where: {
                    ...(Object.keys(dateFilter).length > 0 && { 
                        createdAt: dateFilter 
                    })
                },
                include: {
                    roomCategory: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    roomAllocation: {
                        include: {
                            room: true
                        }
                    },
                    transaction: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 100 // Limit untuk performance
            }),

            // Get summary statistics
            prisma.booking.aggregate({
                where: {
                    ...(Object.keys(dateFilter).length > 0 && { 
                        createdAt: dateFilter 
                    })
                },
                _count: {
                    id: true
                }
            }),

            // Get active bookings (with room allocation but no checkout)
            prisma.booking.count({
                where: {
                    roomAllocation: {
                        checkOut: null
                    }
                }
            }),

            // Get completed bookings (with checkout)  
            prisma.booking.count({
                where: {
                    roomAllocation: {
                        checkOut: { not: null }
                    }
                }
            }),

            // Get room occupancy data
            prisma.room.findMany({
                include: {
                    roomCategory: true,
                    roomAllocationMany: {
                        where: {
                            checkOut: null // Currently occupied
                        },
                        include: {
                            booking: {
                                include: {
                                    user: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        ])

        // Timeout protection
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new Error('Query timeout after 15 seconds'))
            }, 15000)
        })

        const [bookings, summary, activeBookings, completedBookings, rooms] = await Promise.race([
            queryPromise,
            timeoutPromise
        ])

        // Calculate total revenue from room category prices
        const totalRevenue = bookings.reduce((total, booking) => {
            return total + Number(booking.roomCategory.price)
        }, 0)

        // Process room occupancy
        const roomOccupancy = rooms.map((room: any) => ({
            id: room.no,
            name: `Room ${room.no}`,
            category: room.roomCategory.name,
            floor: room.floor,
            isOccupied: room.roomAllocationMany.length > 0,
            currentGuest: room.roomAllocationMany[0]?.booking?.user?.name || null
        }))

        return {
            name: "SUCCESS",
            data: {
                bookings,
                summary: {
                    totalBookings: summary._count.id || 0,
                    totalRevenue,
                    activeBookings,
                    completedBookings
                },
                roomOccupancy
            }
        }

    } catch (error: any) {
        console.error('Report error:', error)

        // Handle specific Prisma errors
        if (error.code === 'P2024') {
            return {
                name: "CONNECTION_POOL_ERROR",
                message: "Database connection pool sedang penuh. Silakan coba beberapa saat lagi."
            }
        }

        if (error.message?.includes('timeout')) {
            return {
                name: "TIMEOUT_ERROR", 
                message: "Query membutuhkan waktu terlalu lama. Coba dengan filter yang lebih spesifik."
            }
        }

        return {
            name: "DATABASE_ERROR",
            message: "Terjadi kesalahan saat mengambil data laporan. Silakan coba lagi."
        }
    }
}
