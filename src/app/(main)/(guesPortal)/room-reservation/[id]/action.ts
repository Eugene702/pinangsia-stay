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
    booking: Prisma.BookingGetPayload<{ select: { bookingTime: true } }>[]
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
                    bookingTime: {
                        gte: getDate({ fromMidnight: true })
                    }
                },
                select: {
                    bookingTime: true
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

        const { roomCategoryId, bookingDate, payment, price } = Object.fromEntries(formData)
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

        const { booking, createPayment } = await prisma.$transaction(async e => {
            const [booking, createPayment] = await Promise.all([
                await e.booking.create({
                    data: {
                        userId: user.id,
                        roomCategoryId: roomCategoryId as string,
                        bookingTime: new Date(bookingDate as string),
                        createdAt: getDate()
                    },
                }),

                await xenditClient.PaymentRequest.createPaymentRequest({
                    data: {
                        currency: "IDR",
                        amount: Number(price),
                        paymentMethod: {
                            virtualAccount: {
                                channelCode: payment as VirtualAccountChannelCode,
                                channelProperties: {
                                    customerName: `Pinangsia Stay - ${user.name}`
                                }
                            },
                            type: "VIRTUAL_ACCOUNT",
                            reusability: "ONE_TIME_USE",
                        }
                    }
                })
            ])

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

export const PATCH = async (storeResponse: StoreResponseType) => {
    try {
        const [checkStatus, booking] = await Promise.all([
            xenditClient.PaymentRequest.getPaymentRequestByID({ paymentRequestId: storeResponse.paymentResponse.id }),
            prisma.booking.findUnique({
                where: { id: storeResponse.bookingId },
                select: {
                    id: true,
                    bookingTime: true,
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
            // Prepare booking details for WhatsApp message
            const bookingDetails: BookingDetails = {
                bookingId: booking.id,
                userName: booking.user.name,
                userPhone: booking.user.telp || '',
                roomCategoryName: booking.roomCategory.name,
                bookingDate: moment(booking.bookingTime).format('dddd, DD MMMM YYYY'),
                price: Number(booking.roomCategory.price),
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