"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FaSignInAlt } from "react-icons/fa"

const Pagination = dynamic(() => import('@/components/pagination'))
const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))

const Table = () => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isLoading: false,
        isOpen: false,
        message: "",
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false })),
        onConfirm: () => {},
        title: ""
    })

    const handleOnClickCheckIn = (index: number) => {
        setConfirmationModal(prev => ({
            ...prev,
            title: "Konfirmasi Check In",
            message: `Apakah anda yakin ingin check in tamu ini?`,
            isOpen: true,
            onConfirm: () => handleOnConfirmCheckIn(index),
        }))
    }

    const handleOnConfirmCheckIn = (index: number) => {

    }

    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Foto Tamu</th>
                    <th>Nomor Identitas Tamu</th>
                    <th>Nama Tamu</th>
                    <th>Kamar Yang Dipesan</th>
                    <th>Jam Reservasi</th>
                    <th>Pelunasan</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>
                        <div className="avatar">
                            <div className="mask mask-squircle w-24">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                    </td>
                    <td>123456789</td>
                    <td>Alvin</td>
                    <td>101</td>
                    <td>12:00</td>
                    <td>Lunas</td>
                    <td>
                        <div className="flex items-center gap-2">
                            <button className="btn btn-ghost btn-sm btn-circle" onClick={() => handleOnClickCheckIn(0)}>
                                <FaSignInAlt />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <ConfirmationModal {...confirmationModal} />
        <Pagination
            hasNext={false}
            hasPrev={false} />
    </>
}

export default Table