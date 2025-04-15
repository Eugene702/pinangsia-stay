"use server"

import { prisma } from "@/utils/database"
import { getDate } from "@/utils/moment"
import xenditClient from "@/utils/xendit"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PaymentRequest, VirtualAccountChannelCode } from "xendit-node/payment_request/models"

export type GetResponseType = {
    roomCategory: Prisma.RoomCategoryGetPayload<{ select: { photo: true, name: true, price: true, id: true } }>,
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
                    price: true
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

        const [booking, createPayment] = await Promise.all([
            await prisma.booking.create({
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

        await prisma.transaction.create({
            data: {
                id: booking.id,
                transactionId: createPayment.id,
                transactionMethodId: createPayment.paymentMethod.id
            }
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
        const checkStatus = await xenditClient.PaymentRequest.getPaymentRequestByID({ paymentRequestId: storeResponse.paymentResponse.id })
        if (checkStatus.status === "SUCCEEDED") {
            await prisma.booking.update({
                where: { id: storeResponse.bookingId },
                data: {
                    paidOff: getDate()
                }
            })

            revalidatePath("/", "layout")
            return {
                name: "SUCCESS",
                message: "Pembayaran berhasil dilakukan!"
            }
        }else{
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