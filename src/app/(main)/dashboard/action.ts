"use server"

import { prisma } from "@/utils/database"
import xenditClient from "@/utils/xendit"

export const GET = async () => {
    try{
        const [ room, roomCategory, user, balance, totalBookings, totalRevenue ] = await Promise.all([
            prisma.room.count(),
            prisma.roomCategory.count(),
            prisma.user.count({
                where: {
                    deletedAt: null,
                    role: "RECIPIENT"
                }
            }),
            xenditClient.Balance.getBalance({currency: "IDR"}),
            // Count total bookings
            prisma.booking.count({
                where: {
                    NOT: { paidOff: null }
                }
            }),
            // Calculate total revenue
            prisma.booking.findMany({
                where: {
                    NOT: { paidOff: null }
                },
                include: {
                    roomCategory: {
                        select: { price: true }
                    }
                }
            }).then(bookings => 
                bookings.reduce((sum, booking) => sum + Number(booking.roomCategory.price), 0)
            )
        ])

        // Get booking data for charts - simplified queries
        const [recentBookings, roomCategoryStats] = await Promise.all([
            // Recent bookings for trend
            prisma.booking.findMany({
                where: {
                    NOT: { paidOff: null },
                    bookingTime: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                },
                include: {
                    roomCategory: {
                        select: { name: true, price: true }
                    }
                },
                orderBy: { bookingTime: 'asc' }
            }),
            
            // Bookings by room category
            prisma.roomCategory.findMany({
                include: {
                    booking: {
                        where: {
                            NOT: { paidOff: null }
                        }
                    }
                }
            })
        ])

        console.log(balance)
        return {
            name: "SUCCESS",
            data: {
                room,
                roomCategory,
                user,
                balance,
                bookingStats: {
                    totalBookings,
                    totalRevenue
                },
                chartData: {
                    recentBookings,
                    roomCategoryStats: roomCategoryStats.map(category => ({
                        name: category.name,
                        bookingCount: category.booking.length,
                        revenue: category.booking.reduce((sum, booking) => sum + Number(category.price), 0)
                    }))
                }
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

export const getDashboardChartData = async (period: "day" | "week" | "month" | "year") => {
    try {
        const now = new Date()
        let startDate: Date
        let dateFormat: string
        let groupBy: any

        switch (period) {
            case "day":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
                dateFormat = "DD/MM"
                groupBy = {
                    day: { $dayOfMonth: "$createdAt" },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
                break
            case "week":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7 * 4)
                dateFormat = "Week %U"
                groupBy = {
                    week: { $week: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
                break
            case "month":
                startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
                dateFormat = "MMM YYYY"
                groupBy = {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
                break
            case "year":
                startDate = new Date(now.getFullYear() - 4, 0, 1)
                dateFormat = "YYYY"
                groupBy = {
                    year: { $year: "$createdAt" }
                }
                break
            default:
                startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
                dateFormat = "MMM YYYY"
                groupBy = {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
        }

        // Get real data from database
        const [roomCategories, totalUsers, roomsData, recentUsers] = await Promise.all([
            // Real room categories data
            prisma.roomCategory.findMany({
                include: {
                    _count: {
                        select: {
                            room: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            // Real users data by role and creation date
            prisma.user.findMany({
                where: {
                    deletedAt: null
                },
                select: {
                    role: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            // Real rooms data by creation date
            prisma.room.findMany({
                select: {
                    createdAt: true,
                    roomCategory: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            // Recent user registrations for trend
            prisma.user.findMany({
                where: {
                    deletedAt: null,
                    createdAt: {
                        gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
                    }
                },
                select: {
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        ])

        const roomCategoriesData = roomCategories.map(category => ({
            name: category.name,
            count: category._count.room
        }))

        // Generate real chart data based on period
        const reservationsData = generateRealChartData(totalUsers, period, "users")
        const revenueData = generateRevenueData(period) // This will be sample until we have transaction data
        const checkinsData = generateRealChartData(recentUsers, period, "registrations")

        return {
            name: "SUCCESS",
            data: {
                reservations: reservationsData,
                revenue: revenueData,
                checkins: checkinsData,
                roomCategories: roomCategoriesData.length > 0 ? roomCategoriesData : [
                    { name: "Belum ada kategori", count: 0 }
                ],
                isRealData: {
                    roomCategories: true,
                    reservations: true, // Using real user registration data
                    revenue: false, // Still sample until we have transaction system
                    checkins: true // Using real user data
                }
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

function generateRealChartData(data: any[], period: string, type: string): any[] {
    const chartData: any[] = []
    const now = new Date()
    
    let periods: string[] = []
    let startDates: Date[] = []
    
    switch (period) {
        case "day":
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now)
                date.setDate(date.getDate() - i)
                periods.push(date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }))
                startDates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
            }
            break
        case "week":
            for (let i = 3; i >= 0; i--) {
                const startOfWeek = new Date(now)
                startOfWeek.setDate(startOfWeek.getDate() - (i * 7))
                periods.push(`Minggu ${4 - i}`)
                startDates.push(startOfWeek)
            }
            break
        case "month":
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now)
                date.setMonth(date.getMonth() - i)
                periods.push(months[date.getMonth()])
                startDates.push(new Date(date.getFullYear(), date.getMonth(), 1))
            }
            break
        case "year":
            for (let i = 4; i >= 0; i--) {
                const year = now.getFullYear() - i
                periods.push(year.toString())
                startDates.push(new Date(year, 0, 1))
            }
            break
    }
    
    periods.forEach((periodLabel, index) => {
        const periodStart = startDates[index]
        const periodEnd = index < startDates.length - 1 ? startDates[index + 1] : now
        
        const count = data.filter(item => {
            const itemDate = new Date(item.createdAt)
            return itemDate >= periodStart && itemDate < periodEnd
        }).length
        
        chartData.push({
            period: periodLabel,
            count: count
        })
    })
    
    return chartData
}

function generateRevenueData(period: string): any[] {
    // For now, return empty data since we don't have transaction system yet
    // This will be replaced when transaction system is implemented
    const chartData: any[] = []
    const now = new Date()
    
    let periods: string[] = []
    
    switch (period) {
        case "day":
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now)
                date.setDate(date.getDate() - i)
                periods.push(date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }))
            }
            break
        case "week":
            for (let i = 3; i >= 0; i--) {
                periods.push(`Minggu ${4 - i}`)
            }
            break
        case "month":
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now)
                date.setMonth(date.getMonth() - i)
                periods.push(months[date.getMonth()])
            }
            break
        case "year":
            for (let i = 4; i >= 0; i--) {
                periods.push((now.getFullYear() - i).toString())
            }
            break
    }
    
    periods.forEach(periodLabel => {
        chartData.push({
            period: periodLabel,
            amount: 0 // No revenue data yet
        })
    })
    
    return chartData
}

function generateSampleData(period: string, type: string): any[] {
    const data: any[] = []
    const now = new Date()
    
    let periods: string[] = []
    let baseValue = type === "revenue" ? 500000 : 5 // Reduced for more realistic demo
    
    switch (period) {
        case "day":
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now)
                date.setDate(date.getDate() - i)
                periods.push(date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }))
            }
            break
        case "week":
            for (let i = 3; i >= 0; i--) {
                periods.push(`Minggu ${4 - i}`)
            }
            baseValue = type === "revenue" ? 2000000 : 20
            break
        case "month":
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now)
                date.setMonth(date.getMonth() - i)
                periods.push(months[date.getMonth()])
            }
            baseValue = type === "revenue" ? 8000000 : 80
            break
        case "year":
            for (let i = 4; i >= 0; i--) {
                periods.push((now.getFullYear() - i).toString())
            }
            baseValue = type === "revenue" ? 100000000 : 1000
            break
    }
    
    periods.forEach((period, index) => {
        // Make data more realistic - some periods have 0 or very low values
        const shouldHaveData = Math.random() > 0.2 // 80% chance of having data
        const variation = shouldHaveData ? (Math.random() * 0.8 + 0.2) : 0 // 0.2 to 1.0 multiplier or 0
        const value = Math.round(baseValue * variation)
        
        if (type === "reservations" || type === "checkins") {
            data.push({
                period,
                count: value,
                isDemo: true
            })
        } else if (type === "revenue") {
            data.push({
                period,
                amount: value,
                isDemo: true
            })
        }
    })
    
    return data
}