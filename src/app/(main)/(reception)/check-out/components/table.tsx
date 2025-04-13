"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FaSignOutAlt } from "react-icons/fa"
import { GetResponseType, PATCH } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { formatDate } from "@/utils/moment"
import moment from "moment-timezone"
import "moment/locale/id"
import { showToast } from "@/utils/toast"

const Pagination = dynamic(() => import('@/components/pagination'))
const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))

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
            title: "Konfirmasi Check In",
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
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Foto Tamu</th>
                    <th>Nama Tamu</th>
                    <th>Nomor Kamar</th>
                    <th>Kamar Yang Dipesan</th>
                    <th>Jam Check-In</th>
                    <th>Waktu Check-Out</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {
                    response.roomAllocation.map((e, index) => <tr key={index}>
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
                        <td>{ e.booking.user.name }</td>
                        <td>{ e.room.no }</td>
                        <td>{ e.room.roomCategory.name }</td>
                        <td>{ formatDate(e.checkIn, "DD MMMM YYYY HH:mm") }</td>
                        <td>{ moment(e.checkIn).add(24, "hours").locale("id-ID").fromNow() }</td>
                        <td>
                            <div className="flex items-center gap-2">
                                <button className="btn btn-ghost btn-sm btn-circle" onClick={() => handleOnClickCheckIn(e)}>
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        </td>
                    </tr>)
                }
            </tbody>
        </table>

        <ConfirmationModal {...confirmationModal} />
        <Pagination
            hasNext={response.pagination.nextPage != null}
            hasPrev={response.pagination.previousPage != null} />
    </>
}

export default Table