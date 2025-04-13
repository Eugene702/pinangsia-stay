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
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {
                    data.booking.map((e, index) => <tr key={index}>
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
                            <div className="flex items-center gap-2">
                                <button className="btn btn-ghost btn-sm btn-circle" onClick={() => handleOnClickCheckIn(e)}>
                                    <FaSignInAlt />
                                </button>
                            </div>
                        </td>
                    </tr>)
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