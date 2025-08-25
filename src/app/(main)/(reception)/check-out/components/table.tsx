"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FaSignOutAlt } from "react-icons/fa"
import { GetResponseType, PATCH } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { formatDate } from "@/utils/moment"
import { converToRupiah } from "@/utils/utils"
import moment from "moment-timezone"
import "moment/locale/id"
import { showToast } from "@/utils/toast"

const Pagination = dynamic(() => import('@/components/pagination'))
const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))

// Utility function for calculating nights
const calculateNights = (checkInDate: Date | string | null, checkOutDate: Date | string | null): number => {
    if (!checkInDate || !checkOutDate) return 1
    
    const checkIn = moment(checkInDate).startOf('day')
    const checkOut = moment(checkOutDate).startOf('day')
    const nights = checkOut.diff(checkIn, 'days')
    
    return nights > 0 ? nights : 1
}

const Table = ({ response }: { response: GetResponseType }) => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isLoading: false,
        isOpen: false,
        message: "",
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false })),
        onConfirm: () => { },
        title: ""
    })

    const handleOnClickCheckIn = (data: GetResponseType['roomAllocation'][number]) => {
        setConfirmationModal(prev => ({
            ...prev,
            title: "Konfirmasi Check Out",
            message: `Apakah anda yakin ingin check out tamu ${data.booking.user.name} ini?`,
            isOpen: true,
            onConfirm: () => handleOnConfirmCheckIn(data),
        }))
    }

    const handleOnConfirmCheckIn = async(data: GetResponseType['roomAllocation'][number]) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        const response = await PATCH(data.id)
        if(response.name === "SUCCESS"){
            showToast("success", response.message!)
        }else{
            showToast("error", response.message!)
        }

        setConfirmationModal(prev => ({ ...prev, isLoading: false, isOpen: false }))
    }

    return <>
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th className="min-w-[100px]">Foto Tamu</th>
                        <th className="min-w-[150px]">Nama Tamu</th>
                        <th className="min-w-[100px]">Booking ID</th>
                        <th className="min-w-[100px]">Nomor Kamar</th>
                        <th className="min-w-[180px]">Kamar Yang Dipesan</th>
                        <th className="min-w-[120px]">Check-In Booking</th>
                        <th className="min-w-[120px]">Check-Out Booking</th>
                        <th className="min-w-[120px]">Durasi Menginap</th>
                        <th className="min-w-[120px]">Total Bayar</th>
                        <th className="min-w-[150px]">Jam Check-In Aktual</th>
                        <th className="min-w-[80px]">Aksi</th>
                    </tr>
                </thead>

            <tbody>
                {response.roomAllocation.length === 0 ? (
                    <tr>
                        <td colSpan={11} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <span className="text-gray-500 font-medium">Tidak ada tamu yang perlu check-out</span>
                                <span className="text-gray-400 text-sm">Semua tamu telah check-out atau belum ada yang check-in</span>
                            </div>
                        </td>
                    </tr>
                ) : (
                    response.roomAllocation.map((e, index) => {
                        // Calculate nights and total price using utility function
                        const checkInDate = e.booking.checkInDate || e.booking.bookingTime
                        const checkOutDate = e.booking.checkOutDate
                        
                        const nights = calculateNights(checkInDate, checkOutDate)
                        const pricePerNight = Number(e.booking.roomCategory.price)
                        const totalPrice = pricePerNight * nights
                        
                        return <tr key={index}>
                            <td>
                                <div className="avatar">
                                    <div className="mask mask-squircle w-24">
                                        <Image
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            src={e.booking.user.photo ? getCldImageUrl({ src: e.booking.user.photo }) : "/images/logo.png"}
                                            alt={`Foto tamu`} />
                                    </div>
                                </div>
                            </td>
                            <td className="font-semibold">{ e.booking.user.name }</td>
                            <td className="text-sm font-mono">{ e.booking.id.slice(-8) }</td>
                            <td className="font-semibold text-blue-600">{ e.room.no }</td>
                            <td>{ e.room.roomCategory.name }</td>
                            <td>
                                {e.booking.checkInDate 
                                    ? formatDate(e.booking.checkInDate, "DD MMM YYYY") 
                                    : formatDate(e.booking.bookingTime, "DD MMM YYYY")
                                }
                            </td>
                            <td>
                                {e.booking.checkOutDate 
                                    ? formatDate(e.booking.checkOutDate, "DD MMM YYYY") 
                                    : <span className="text-gray-500 italic">Tidak diset</span>
                                }
                            </td>
                            <td className="font-semibold">
                                <span className="badge badge-primary">{ nights } malam</span>
                            </td>
                            <td className="font-semibold text-green-600">{ converToRupiah(totalPrice) }</td>
                            <td>{ formatDate(e.checkIn, "DD MMM YYYY HH:mm") }</td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="btn btn-error btn-sm btn-circle tooltip tooltip-left" 
                                        data-tip="Check Out"
                                        onClick={() => handleOnClickCheckIn(e)}
                                    >
                                        <FaSignOutAlt />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    })
                )}
            </tbody>
            </table>
        </div>

        <ConfirmationModal {...confirmationModal} />
        <Pagination
            hasNext={response.pagination.nextPage != null}
            hasPrev={response.pagination.previousPage != null} />
    </>
}

export default Table