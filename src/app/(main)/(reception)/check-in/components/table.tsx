"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FaSignInAlt } from "react-icons/fa"
import { GetResponseType, STORE } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { formatDate } from "@/utils/moment"
import { showToast } from "@/utils/toast"
import { getBookingStatus, canCheckIn, getStatusBadgeClass, getStatusLabel } from "@/utils/bookingStatus"

const Pagination = dynamic(() => import('@/components/pagination'))
const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))

const Table = ({ data }: { data: GetResponseType }) => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isLoading: false,
        isOpen: false,
        message: "",
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false })),
        onConfirm: () => { },
        title: ""
    })

    const handleOnClickCheckIn = (data: GetResponseType['booking'][number]) => {
        setConfirmationModal(prev => ({
            ...prev,
            title: "Konfirmasi Check In",
            message: `Apakah anda yakin ingin check in tamu ${data.user.name} ini?`,
            isOpen: true,
            onConfirm: () => handleOnConfirmCheckIn(data),
        }))
    }

    const handleOnConfirmCheckIn = async (data: GetResponseType['booking'][number]) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        const response = await STORE(data)
        setConfirmationModal(prev => ({ ...prev, isLoading: false, isOpen: false }))
        if(response.name === "SUCCESS"){
            showToast("success", `Berhasil check in tamu ${data.user.name} ke kamar ${response.data?.roomId}`, 7000)
        }else{
            showToast("error", response.message!)
        }
    }

    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Foto Tamu</th>
                    <th>Nama Tamu</th>
                    <th>Kamar Yang Dipesan</th>
                    <th>Jam Reservasi</th>
                    <th>Pelunasan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>

            <tbody>
                {
                    data.booking.map((e, index) => {
                        const status = getBookingStatus(e.bookingTime)
                        const canPerformCheckIn = canCheckIn(e.bookingTime)
                        const badgeClass = getStatusBadgeClass(status)
                        const statusLabel = getStatusLabel(status)
                        
                        return (
                            <tr key={index} className={status === 'EXPIRED' ? 'opacity-75' : ''}>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-24">
                                            <Image
                                                src={e.user.photo ? getCldImageUrl({ src: e.user.photo }) : "/images/logo.png"}
                                                width={0}
                                                height={0}
                                                alt={`Foto pengguna ${e.user.name}`}
                                                sizes="100vw" />
                                        </div>
                                    </div>
                                </td>
                                <td>{ e.user.name }</td>
                                <td>{ e.roomCategory.name }</td>
                                <td>{ formatDate(e.bookingTime, "DD MMMM YYYY") }</td>
                                <td>{ e.paidOff ? formatDate(e.paidOff, "DD MMMM YYYY") : "Belum terbayar!" }</td>
                                <td>
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
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        {canPerformCheckIn ? (
                                            <button 
                                                className="btn btn-ghost btn-sm btn-circle hover:btn-primary" 
                                                onClick={() => handleOnClickCheckIn(e)}
                                                title="Check In"
                                            >
                                                <FaSignInAlt />
                                            </button>
                                        ) : (
                                            <button 
                                                className="btn btn-ghost btn-sm btn-circle" 
                                                disabled
                                                title="Booking sudah expired"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>

        <ConfirmationModal {...confirmationModal} />
        <Pagination
            hasNext={data.pagination.nextPage != null}
            hasPrev={data.pagination.previousPage != null} />
    </>
}

export default Table