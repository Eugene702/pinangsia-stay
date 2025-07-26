"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FaSignInAlt } from "react-icons/fa"
import { PendingCheckInType, CHECK_IN } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { formatDate } from "@/utils/moment"
import { showToast } from "@/utils/toast"
import { getBookingStatus, canCheckIn, getStatusBadgeClass, getStatusLabel } from "@/utils/bookingStatus"

const Pagination = dynamic(() => import('@/components/pagination'))
const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))

interface CheckInTableProps {
    data: PendingCheckInType
}

const CheckInTable = ({ data }: CheckInTableProps) => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isLoading: false,
        isOpen: false,
        message: "",
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false })),
        onConfirm: () => { },
        title: ""
    })

    const handleOnClickCheckIn = (booking: PendingCheckInType['bookings'][number]) => {
        setConfirmationModal(prev => ({
            ...prev,
            title: "Konfirmasi Check In",
            message: `Apakah anda yakin ingin check in tamu ${booking.user.name} ini?`,
            isOpen: true,
            onConfirm: () => handleOnConfirmCheckIn(booking),
        }))
    }

    const handleOnConfirmCheckIn = async (booking: PendingCheckInType['bookings'][number]) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        const response = await CHECK_IN(booking)
        setConfirmationModal(prev => ({ ...prev, isLoading: false, isOpen: false }))
        
        if (response.name === "SUCCESS") {
            showToast("success", `Berhasil check in tamu ${booking.user.name} ke kamar ${response.data?.roomId}`, 7000)
        } else {
            showToast("error", response.message!)
        }
    }

    const formatCurrency = (amount: bigint) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(amount))
    }

    if (data.bookings.length === 0) {
        return (
            <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak Ada Tamu Menunggu</h3>
                <p className="text-gray-500">Tidak ada tamu yang menunggu untuk check-in hari ini.</p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Foto Tamu</th>
                            <th>Info Tamu</th>
                            <th>Kategori Kamar</th>
                            <th>Waktu Booking</th>
                            <th>Total Bayar</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.bookings.map((booking, index) => (
                            <tr key={index} className="hover">
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-16 h-16">
                                            <Image
                                                src={booking.user.photo ? getCldImageUrl({ src: booking.user.photo }) : "/images/logo.png"}
                                                width={64}
                                                height={64}
                                                alt={`Foto ${booking.user.name}`}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="font-bold text-lg">{booking.user.name}</div>
                                        <div className="text-sm opacity-70">{booking.user.email}</div>
                                        {booking.user.telp && (
                                            <div className="text-sm opacity-70">{booking.user.telp}</div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="font-semibold text-primary">{booking.roomCategory.name}</div>
                                    <div className="text-sm opacity-70">
                                        {formatCurrency(booking.roomCategory.price)}/malam
                                    </div>
                                </td>
                                <td>
                                    <div className="text-sm">
                                        <div>{formatDate(booking.bookingTime, "DD MMM YYYY")}</div>
                                        <div className="opacity-70">{formatDate(booking.bookingTime, "HH:mm")}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold text-success">
                                        {formatCurrency(booking.roomCategory.price)}
                                    </div>
                                    {booking.paidOff && (
                                        <div className="text-xs text-success">
                                            Dibayar {formatDate(booking.paidOff, "DD MMM")}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {(() => {
                                        const status = getBookingStatus(booking.bookingTime)
                                        const badgeClass = getStatusBadgeClass(status)
                                        const statusLabel = getStatusLabel(status)
                                        
                                        return (
                                            <div className={`badge ${badgeClass} gap-2`}>
                                                {status === 'ACTIVE' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                                {statusLabel}
                                            </div>
                                        )
                                    })()}
                                </td>
                                <td>
                                    {canCheckIn(booking.bookingTime) ? (
                                        <button 
                                            className="btn btn-primary btn-sm gap-2"
                                            onClick={() => handleOnClickCheckIn(booking)}
                                        >
                                            <FaSignInAlt className="h-3 w-3" />
                                            Check In
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-disabled btn-sm gap-2"
                                            disabled
                                            title="Booking sudah expired"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                            </svg>
                                            Expired
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <Pagination
                    hasNext={data.pagination.nextPage != null}
                    hasPrev={data.pagination.previousPage != null}
                />
            </div>

            <ConfirmationModal {...confirmationModal} />
        </>
    )
}

export default CheckInTable
