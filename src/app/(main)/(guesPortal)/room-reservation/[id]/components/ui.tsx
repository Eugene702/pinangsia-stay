"use client"

import { getCldImageUrl } from "next-cloudinary"
import { GetResponseType, PATCH, STORE, StoreResponseType } from "../action"
import Image from "next/image"
import { converToRupiah } from "@/utils/utils"
import { copyToClipboard } from "@/utils/clipboard"
import "cally"
import moment from "moment-timezone"
import { getDate } from "@/utils/moment"
import { useFormik } from "formik"
import { showToast, setModalErrorCallback, clearModalErrorCallback } from "@/utils/toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ModalErrorDisplay from "@/components/modalErrorDisplay"
import { SweetAlertIcon } from "sweetalert2"

// Configure moment locale
moment.locale('en')

const Ui = ({ data }: { data: GetResponseType }) => {
    const router = useRouter()
    const [paymentResponse, setPaymentResponse] = useState<StoreResponseType | null>(null)
    const [loading, setLoading] = useState<"CHECK_PAYMENT" | null>(null)
    const [modalError, setModalError] = useState<{
        show: boolean
        type: SweetAlertIcon
        message: string
    }>({
        show: false,
        type: 'error',
        message: ''
    })

    // Setup modal error callback
    useEffect(() => {
        const callback = (type: SweetAlertIcon, message: string) => {
            setModalError({
                show: true,
                type,
                message
            })
        }
        
        setModalErrorCallback(callback)
        
        return () => {
            clearModalErrorCallback()
        }
    }, [])

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
                setPaymentResponse(null)
                resetForm()
                router.push("/room-reservation")
            }
            setLoading(null)
        }
    }

    const handleCopyVirtualAccount = () => {
        const virtualAccountNumber = paymentResponse?.paymentResponse.paymentMethod.virtualAccount?.channelProperties.virtualAccountNumber || ''
        copyToClipboard(
            virtualAccountNumber,
            "Virtual account number copied to clipboard!",
            "Failed to copy virtual account number. Please copy manually."
        )
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

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
                <p className="text-gray-600">Select your preferred dates and payment method</p>
            </div>

            {/* Room Details Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="md:flex">
                    <div className="md:w-2/5">
                        <div className="relative h-64 md:h-full">
                            <Image
                                src={getCldImageUrl({ src: data.roomCategory.photo })}
                                fill
                                className="object-cover"
                                alt={data.roomCategory.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            {data.roomCategory.detail?.maxOccupancy && (
                                <div className="absolute top-4 left-4">
                                    <div className="bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-white text-sm font-medium">{data.roomCategory.detail.maxOccupancy} Guests</span>
                                    </div>
                                </div>
                            )}
                            {data.roomCategory.detail?.roomSize && (
                                <div className="absolute top-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                                        <span className="text-gray-700 text-sm font-medium">{data.roomCategory.detail.roomSize}m²</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:w-3/5 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.roomCategory.name}</h2>
                                {data.roomCategory.detail?.bedType && (
                                    <p className="text-gray-600 mb-2">
                                        {data.roomCategory.detail.bedType} • {data.roomCategory.detail.viewType || 'Standard View'}
                                    </p>
                                )}
                                <p className="text-gray-600">
                                    {data.roomCategory.description || 'Premium accommodation with luxury amenities'}
                                </p>
                            </div>
                            <div className="text-right ml-6">
                                <div className="bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                                    <span className="text-2xl font-bold text-red-600">
                                        {converToRupiah(Number(data.roomCategory.price))}
                                    </span>
                                    <p className="text-sm text-red-500 font-medium">per night</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Room Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Facilities */}
                            {data.roomCategory.detail?.facilities && data.roomCategory.detail.facilities.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Room Facilities
                                    </h4>
                                    <div className="space-y-2">
                                        {data.roomCategory.detail.facilities.map((facility, idx) => (
                                            <div key={idx} className="flex items-center text-sm text-gray-600">
                                                <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {facility}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Amenities */}
                            {data.roomCategory.detail?.amenities && data.roomCategory.detail.amenities.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        Amenities
                                    </h4>
                                    <div className="space-y-2">
                                        {data.roomCategory.detail.amenities.map((amenity, idx) => (
                                            <div key={idx} className="flex items-center text-sm text-gray-600">
                                                <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Room Policies */}
                        {data.roomCategory.detail?.policies && data.roomCategory.detail.policies.length > 0 && (
                            <div className="border-t border-gray-100 pt-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Room Policies
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.roomCategory.detail.policies.map((policy, idx) => (
                                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                            {policy}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Modal Error Display - Positioned above form sections */}
                <ModalErrorDisplay
                    show={modalError.show}
                    type={modalError.type}
                    message={modalError.message}
                    onClose={() => setModalError(prev => ({ ...prev, show: false }))}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Date</h3>
                            <p className="text-gray-600 text-sm">Choose your preferred check-in date</p>
                        </div>
                        
                        <div className="flex justify-center">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <calendar-date
                                    locale="id-ID"
                                    isDateDisallowed={checkAvailability}
                                    onchange={e => setValues({ ...values, date: (e.target as unknown as { value: string }).value })}>
                                    <calendar-month></calendar-month>
                                </calendar-date>
                            </div>
                        </div>
                        
                        {values.date && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-green-800 font-medium">
                                        Selected: {moment(values.date).format('dddd, MMMM Do YYYY')}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Method</h3>
                            <p className="text-gray-600 text-sm">Choose your preferred bank for virtual account</p>
                        </div>
                        
                        <div className="space-y-3">
                            {[
                                { value: "BNI", name: "Bank Negara Indonesia", color: "orange" },
                                { value: "BCA", name: "Bank Central Asia", color: "blue" },
                                { value: "BRI", name: "Bank Rakyat Indonesia", color: "red" },
                                { value: "CIMB", name: "CIMB Niaga", color: "red" },
                                { value: "MANDIRI", name: "Bank Mandiri", color: "yellow" }
                            ].map((bank) => (
                                <label key={bank.value} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    values.payment === bank.value 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                } ${paymentResponse ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={bank.value}
                                        onChange={handleChange}
                                        disabled={paymentResponse != null}
                                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="font-medium text-gray-900">{bank.value}</div>
                                        <div className="text-sm text-gray-500">{bank.name}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-600">{bank.value.charAt(0)}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                {paymentResponse && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-green-900 mb-2">Payment Information</h3>
                                <p className="text-green-700 text-sm">Complete your payment using the details below</p>
                            </div>
                            <div className="bg-green-100 px-3 py-1 rounded-full">
                                <span className="text-green-800 font-bold text-sm">Pending Payment</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-green-800">Amount</label>
                                    <div className="text-2xl font-bold text-green-900">
                                        {converToRupiah(paymentResponse.paymentResponse.amount!)}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-green-800">Payment Method</label>
                                    <div className="text-lg font-semibold text-green-900">
                                        {paymentResponse.paymentResponse.paymentMethod.type.split("_").join(" ")} - {paymentResponse.paymentResponse.paymentMethod.virtualAccount?.channelCode}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-green-800">Virtual Account Number</label>
                                <div className="bg-white rounded-lg p-4 border border-green-200 mt-1">
                                    <div className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                                        {paymentResponse.paymentResponse.paymentMethod.virtualAccount?.channelProperties.virtualAccountNumber}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyVirtualAccount}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium mt-2 flex items-center transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy Number
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    {!paymentResponse ? (
                        <button
                            type="submit"
                            disabled={isSubmitting || !values.date || !values.payment}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                        >
                            {isSubmitting && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>Create Booking</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={checkPayment}
                            disabled={loading === "CHECK_PAYMENT"}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                        >
                            {loading === "CHECK_PAYMENT" && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>Verify Payment</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Ui