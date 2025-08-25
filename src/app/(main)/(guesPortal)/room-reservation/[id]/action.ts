"use server"

import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import xenditClient from "@/utils/xendit"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PaymentRequest, VirtualAccountChannelCode } from "xendit-node/payment_request/models"
import { sendWhatsAppMessage, generatePaymentSuccessMessage, BookingDetails } from "@/utils/whatsapp"
import moment from "moment-timezone"

export type GetResponseType = {
    roomCategory: Prisma.RoomCategoryGetPayload<{ 
        select: { 
            photo: true, 
            name: true, 
            price: true, 
            id: true,
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
        } 
    }>,
    booking: Prisma.BookingGetPayload<{ 
        select: { 
            bookingTime: true,
            checkInDate: true,
            checkOutDate: true
        } 
    }>[]
}

export const GET = async (roomCategoryId: string) => {
    try {
        const [roomCategory, booking] = await Promise.all([
            prisma.roomCategory.findUnique({
                where: { id: roomCategoryId },
                select: {
                    id: true,
                    photo: true,
                    name: true,
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
                }
            }),

            prisma.booking.findMany({
                where: {
                    roomCategoryId,
                    NOT: {
                        paidOff: null
                    },
                    OR: [
                        // Legacy bookings using bookingTime only
                        {
                            bookingTime: {
                                gte: getDate({ fromMidnight: true })
                            },
                            checkInDate: null
                        },
                        // New bookings using checkInDate/checkOutDate
                        {
                            checkInDate: {
                                gte: getDate({ fromMidnight: true })
                            }
                        }
                    ]
                },
                select: {
                    bookingTime: true,
                    checkInDate: true,
                    checkOutDate: true
                }
            })
        ])

        if (!roomCategory) {
            return redirect("/room-reservation")
        }

        return {
            name: "SUCCESS",
            data: { roomCategory, booking }
        }
    } catch (e) {
        console.error(e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server!"
        }
    }
}

export type StoreResponseType = {
    bookingId: string,
    paymentResponse: PaymentRequest
}

export const STORE = async (formData: FormData) => {
    try {
        const session = await getServerSession()
        if (session == null || session.user == null || session.user.email === null) {
            return {
                name: "UNAUTHORIZED",
                message: "Anda tidak memiliki akses!"
            }
        }

        const { roomCategoryId, checkInDate, checkOutDate, payment, price, nights } = Object.fromEntries(formData)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (user === null) {
            return {
                name: "USER_NOT_FOUND",
                message: "User tidak ditemukan!"
            }
        }

        if (user.address === null || user.telp === null) {
            return {
                name: "USER_NOT_COMPLETE",
                message: "Lengkapi data diri anda terlebih dahulu!"
            }
        }

        // Validate date range
        const checkIn = new Date(checkInDate as string)
        const checkOut = new Date(checkOutDate as string)
        
        if (checkOut <= checkIn) {
            return {
                name: "INVALID_DATE_RANGE",
                message: "Tanggal check-out harus setelah tanggal check-in!"
            }
        }

        // Check if any dates in the range are already booked
        const existingBookings = await prisma.booking.findMany({
            where: {
                roomCategoryId: roomCategoryId as string,
                NOT: { paidOff: null },
                bookingTime: {
                    gte: checkIn,
                    lt: checkOut
                }
            }
        })

        if (existingBookings.length > 0) {
            return {
                name: "DATE_CONFLICT",
                message: "Beberapa tanggal dalam rentang yang dipilih sudah dibooking!"
            }
        }

        const { booking, createPayment } = await prisma.$transaction(async e => {
            // Try using the new Prisma client first
            const booking = await e.booking.create({
                data: {
                    userId: user.id,
                    roomCategoryId: roomCategoryId as string,
                    checkInDate: checkIn,
                    checkOutDate: checkOut,
                    bookingTime: checkIn, // Keep for backward compatibility
                    createdAt: getDate()
                },
            })

            const createPayment = await xenditClient.PaymentRequest.createPaymentRequest({
                data: {
                    currency: "IDR",
                    amount: Number(price),
                    paymentMethod: {
                        virtualAccount: {
                            channelCode: payment as VirtualAccountChannelCode,
                            channelProperties: {
                                customerName: `Pinangsia Stay - ${user.name} (${nights} nights)`
                            }
                        },
                        type: "VIRTUAL_ACCOUNT",
                        reusability: "ONE_TIME_USE",
                    }
                }
            })

            await e.transaction.create({
                data: {
                    id: booking.id,
                    transactionId: createPayment.id,
                    transactionMethodId: createPayment.paymentMethod.id
                }
            })

            return { booking, createPayment }
        })

        return {
            name: "SUCCESS",
            data: {
                bookingId: booking.id,
                paymentResponse: createPayment
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

export const SIMULATE_PAYMENT = async (storeResponse: StoreResponseType) => {
    try {
        // Only allow simulation in development mode
        if (process.env.NODE_ENV !== 'development') {
            return {
                name: "FORBIDDEN",
                message: "Simulasi pembayaran hanya tersedia dalam mode development!"
            }
        }

        const xenditAuth = process.env.NEXT_PUBLIC_XENDIT_API_KEY
        if (!xenditAuth) {
            return {
                name: "CONFIG_ERROR",
                message: "Xendit API key tidak ditemukan!"
            }
        }

        // Call Xendit simulation API
        const simulationResponse = await fetch(`https://api.xendit.co/v2/payment_methods/${storeResponse.paymentResponse.paymentMethod.id}/payments/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(xenditAuth + ':').toString('base64')}`
            },
            body: JSON.stringify({
                amount: storeResponse.paymentResponse.amount
            })
        })

        if (!simulationResponse.ok) {
            const errorData = await simulationResponse.text()
            console.error('Xendit simulation error:', errorData)
            return {
                name: "SIMULATION_ERROR",
                message: "Gagal melakukan simulasi pembayaran!"
            }
        }

        const simulationData = await simulationResponse.json()
        console.log('Payment simulation successful:', simulationData)

        return {
            name: "SUCCESS",
            message: "Simulasi pembayaran berhasil! Silakan verifikasi pembayaran."
        }
    } catch (e) {
        console.error('Simulation error:', e)
        return {
            name: "SERVER_ERROR",
            message: "Ada kesalahan pada server saat simulasi!"
        }
    }
}

export const PATCH = async (storeResponse: StoreResponseType) => {
    try {
        const [checkStatus, booking] = await Promise.all([
            xenditClient.PaymentRequest.getPaymentRequestByID({ paymentRequestId: storeResponse.paymentResponse.id }),
            prisma.booking.findUnique({
                where: { id: storeResponse.bookingId },
                select: {
                    id: true,
                    bookingTime: true,
                    checkInDate: true,
                    checkOutDate: true,
                    user: {
                        select: { 
                            name: true, 
                            telp: true 
                        }
                    },
                    roomCategory: {
                        select: {
                            name: true,
                            price: true
                        }
                    }
                }
            })
        ])

        if(booking === null){
            return {
                name: "USER_NOT_FOUND",
                message: "Booking tidak ditemukan!"
            }
        }


        if (checkStatus.status === "SUCCEEDED") {
            // Calculate nights and prepare booking details for WhatsApp message
            const checkInDate = booking.checkInDate || booking.bookingTime
            const checkOutDate = booking.checkOutDate
            
            let nights = 1
            let checkInDateStr = moment(checkInDate).format('dddd, DD MMMM YYYY')
            let checkOutDateStr = checkOutDate 
                ? moment(checkOutDate).format('dddd, DD MMMM YYYY')
                : moment(checkInDate).add(1, 'day').format('dddd, DD MMMM YYYY')
            
            if (checkOutDate) {
                nights = moment(checkOutDate).diff(moment(checkInDate), 'days')
            }
            
            const pricePerNight = Number(booking.roomCategory.price)
            const totalPrice = pricePerNight * nights

            const bookingDetails: BookingDetails = {
                bookingId: booking.id,
                userName: booking.user.name,
                userPhone: booking.user.telp || '',
                roomCategoryName: booking.roomCategory.name,
                checkInDate: checkInDateStr,
                checkOutDate: checkOutDateStr,
                nights: nights,
                bookingDate: checkInDateStr, // For backward compatibility
                price: totalPrice,
                pricePerNight: pricePerNight,
                transactionId: storeResponse.paymentResponse.id,
                checkInTime: '14:00 WIB',
                checkOutTime: '12:00 WIB'
            }

            // Generate WhatsApp message
            const whatsappMessage = generatePaymentSuccessMessage(bookingDetails)
            const whatsappTarget = `${booking.user.telp}|${booking.user.name}`

            const [_updateStatus, whatsappSent] = await Promise.all([
                prisma.booking.update({
                    where: { id: storeResponse.bookingId },
                    data: {
                        paidOff: getDate()
                    }
                }),

                sendWhatsAppMessage({
                    target: whatsappTarget,
                    message: whatsappMessage
                })
            ])

            // Log WhatsApp status for debugging
            if (!whatsappSent) {
                console.warn(`WhatsApp notification failed for booking ${storeResponse.bookingId}`)
            }

            revalidatePath("/", "layout")
            return {
                name: "SUCCESS",
                message: whatsappSent 
                    ? "Pembayaran berhasil! Notifikasi WhatsApp telah dikirim." 
                    : "Pembayaran berhasil! (Notifikasi WhatsApp gagal dikirim)"
            }
        } else {
            return {
                name: "UNPAID",
                message: "Pembayaran belum dilakukan!"
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