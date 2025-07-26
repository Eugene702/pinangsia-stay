"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FaSignOutAlt } from "react-icons/fa"
import { CurrentGuestsType, CHECK_OUT } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { formatDate } from "@/utils/moment"
import { showToast } from "@/utils/toast"

const Pagination = dynamic(() => import('@/components/pagination'))
const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))

interface CheckOutTableProps {
    data: CurrentGuestsType
}

const CheckOutTable = ({ data }: CheckOutTableProps) => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isLoading: false,
        isOpen: false,
        message: "",
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false })),
        onConfirm: () => { },
        title: ""
    })

    const handleOnClickCheckOut = (allocation: CurrentGuestsType['allocations'][number]) => {
        setConfirmationModal(prev => ({
            ...prev,
            title: "Konfirmasi Check Out",
            message: `Apakah anda yakin ingin check out tamu ${allocation.booking.user.name} dari kamar ${allocation.room.no}?`,
            isOpen: true,
            onConfirm: () => handleOnConfirmCheckOut(allocation),
        }))
    }

    const handleOnConfirmCheckOut = async (allocation: CurrentGuestsType['allocations'][number]) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        const response = await CHECK_OUT(allocation)
        setConfirmationModal(prev => ({ ...prev, isLoading: false, isOpen: false }))
        
        if (response.name === "SUCCESS") {
            showToast("success", `Berhasil check out tamu ${allocation.booking.user.name} dari kamar ${allocation.room.no}`)
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

    const calculateStayDuration = (checkIn: Date) => {
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - new Date(checkIn).getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    if (data.allocations.length === 0) {
        return (
            <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak Ada Tamu Menginap</h3>
                <p className="text-gray-500">Tidak ada tamu yang sedang menginap saat ini.</p>
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
                            <th>Kamar & Kategori</th>
                            <th>Check In</th>
                            <th>Lama Menginap</th>
                            <th>Total Bayar</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.allocations.map((allocation, index) => (
                            <tr key={index} className="hover">
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-16 h-16">
                                            <Image
                                                src={allocation.booking.user.photo ? getCldImageUrl({ src: allocation.booking.user.photo }) : "/images/logo.png"}
                                                width={64}
                                                height={64}
                                                alt={`Foto ${allocation.booking.user.name}`}
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="font-bold text-lg">{allocation.booking.user.name}</div>
                                        <div className="text-sm opacity-70">{allocation.booking.user.email}</div>
                                        {allocation.booking.user.telp && (
                                            <div className="text-sm opacity-70">{allocation.booking.user.telp}</div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div className="font-bold text-primary text-xl">Kamar {allocation.room.no}</div>
                                        <div className="text-sm opacity-70">Lantai {allocation.room.floor}</div>
                                        <div className="badge badge-outline badge-primary mt-1">
                                            {allocation.booking.roomCategory.name}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="text-sm">
                                        <div className="font-semibold">{formatDate(allocation.checkIn, "DD MMM YYYY")}</div>
                                        <div className="opacity-70">{formatDate(allocation.checkIn, "HH:mm")}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-info">
                                            {calculateStayDuration(allocation.checkIn)}
                                        </div>
                                        <div className="text-xs opacity-70">hari</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold text-success">
                                        {formatCurrency(allocation.booking.roomCategory.price)}
                                    </div>
                                    <div className="text-xs opacity-70">/malam</div>
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-warning btn-sm gap-2"
                                        onClick={() => handleOnClickCheckOut(allocation)}
                                    >
                                        <FaSignOutAlt className="h-3 w-3" />
                                        Check Out
                                    </button>
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

export default CheckOutTable
