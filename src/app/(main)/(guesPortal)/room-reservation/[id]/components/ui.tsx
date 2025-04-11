"use client"

import { getCldImageUrl } from "next-cloudinary"
import { GetResponseType, PATCH, STORE, StoreResponseType } from "../action"
import Image from "next/image"
import { converToRupiah } from "@/utils/utils"
import "cally"
import moment from "moment-timezone"
import { getDate, TIMEZONE } from "@/utils/moment"
import { useFormik } from "formik"
import { showToast } from "@/utils/toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

const Ui = ({ data }: { data: GetResponseType }) => {
    const router = useRouter()
    const [paymentResponse, setPaymentResponse] = useState<StoreResponseType | null>(null)
    const [loading, setLoading] = useState<"CHECK_PAYMENT" | null>(null)
    const { values, setValues, isSubmitting, handleChange, handleSubmit, resetForm } = useFormik({
        initialValues: {
            date: "",
            payment: ""
        },
        onSubmit: async e => {
            const formData = new FormData()
            formData.append("bookingDate", e.date)
            formData.append("roomCategoryId", data.roomCategory.id)
            formData.append("payment", e.payment)
            formData.append('price', data.roomCategory.price.toString())
            const saveData = await STORE(formData)
            if (saveData.name === "SUCCESS") {
                setPaymentResponse(saveData.data!)
            } else {
                showToast("error", saveData.message!)
            }
        }
    })

    const checkPayment = async () => {
        if(paymentResponse){
            setLoading("CHECK_PAYMENT")
            const response = await PATCH(paymentResponse)
            showToast(response.name === "SUCCESS" ? "success" : "error", response.message)
            if(response.name === "SUCCESS"){
                router.push("/room-reservation")
                setPaymentResponse(null)
                resetForm()
            }
            setLoading(null)
        }
    }

    const checkAvailability = (date: Date): boolean => {
        const isAvaible = data.booking.some(booking => moment(booking.bookingTime).isSame(date, "date"))
        const isBeforeDay = moment(date).isBefore(getDate(), "date")

        if(isAvaible){
            return true
        }else{
            return isBeforeDay
        }
    }

    return <div className="card lg:card-side">
        <figure className="max-w-96 w-full">
            <Image
                src={getCldImageUrl({ src: data.roomCategory.photo })}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full"
                alt="Album" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{data.roomCategory.name}</h2>
            <div className="badge badge-primary">{converToRupiah(Number(data.roomCategory.price))}</div>

            <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mt-5">
                    <div className="card shadow w-fit">
                        <div className="card-body">
                            <calendar-date
                                locale="id-ID"
                                isDateDisallowed={checkAvailability}
                                onchange={e => setValues({ ...values, date: (e.target as unknown as { value: string }).value })}>
                                <calendar-month></calendar-month>
                            </calendar-date>
                        </div>
                    </div>

                    <div className="card shadow">
                        <div className="card-body">
                            <div className="card-title">Metode Pembayaran</div>
                            <div className="flex gap-2 items-center">
                                <input type="radio" name="payment" className="radio" disabled={paymentResponse != null} onChange={handleChange} value="BNI" />
                                <span>BNI</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input type="radio" name="payment" className="radio" disabled={paymentResponse != null} onChange={handleChange} value="BCA" />
                                <span>BCA</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input type="radio" name="payment" className="radio" disabled={paymentResponse != null} onChange={handleChange} value="BRI" />
                                <span>BRI</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input type="radio" name="payment" className="radio" disabled={paymentResponse != null} onChange={handleChange} value="CIMB" />
                                <span>CIMB</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <input type="radio" name="payment" className="radio" disabled={paymentResponse != null} onChange={handleChange} value="MANDIRI" />
                                <span>Mandiri</span>
                            </div>
                        </div>
                    </div>

                    {
                        paymentResponse ? <div className="card card-shadow">
                            <div className="card-body">
                                <div className="card-title">Pembayaran</div>
                                <span className="badge badge-primary">{converToRupiah(paymentResponse.paymentResponse.amount!)}</span>
                                <span className="text-xl font-bold">{paymentResponse.paymentResponse.paymentMethod.type.split("_").join(" ")} - { paymentResponse.paymentResponse.paymentMethod.virtualAccount?.channelCode }</span>
                                <span className="text-lg">Nomor Virtual Account {paymentResponse.paymentResponse.paymentMethod.virtualAccount?.channelProperties.virtualAccountNumber}</span>
                            </div>
                        </div> : null
                    }
                </div>

                <div className="card-actions justify-end">
                    <button className="btn btn-primary" disabled={isSubmitting || paymentResponse != null}>
                        {isSubmitting ? <div className="loading"></div> : null}
                        <span>Buat Pesanan</span>
                    </button>

                    {
                        paymentResponse != null ? <button type="button" className="btn btn-primary" onClick={checkPayment} disabled={loading === "CHECK_PAYMENT"}>
                            { loading === "CHECK_PAYMENT" ? <div className="loading"></div> : null }
                            <span>Cek Pembayaran</span>
                        </button> : null
                    }
                </div>
            </form>
        </div>
    </div>
}

export default Ui