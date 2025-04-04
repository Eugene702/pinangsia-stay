"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { FaTrash } from "react-icons/fa"
import { FaPencil } from "react-icons/fa6"

const Pagination = dynamic(() => import('@/components/pagination'))
const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))

const Table = () => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isLoading: false,
        isOpen: false,
        message: "",
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false })),
        onConfirm: () => {},
        title: "",
    })

    const handleOnClickDelete = (index: number) => {
        setConfirmationModal(prev => ({
            ...prev,
            title: "Hapus Kamar",
            message: `Apakah kamu yakin ingin menghapus kamar ${index}?`,
            isOpen: true,
            onConfirm: () => handleOnConfirmDeleteRooms(index),
        }))
    }

    const handleOnConfirmDeleteRooms = (index: number) => {

    }

    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Foto</th>
                    <th>Nomor Kamar</th>
                    <th>Kategori Kamar</th>
                    <th>Harga</th>
                    <th>Lantai</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>
                        <div className="avatar">
                            <div className="mask mask-squircle w-24">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                    </th>
                    <td>101</td>
                    <td>Superior</td>
                    <td>Rp 1.000.000</td>
                    <td>1</td>
                    <td>
                        <div className="flex items-center gap-2">
                            <Link href={`/rooms/sdjsd`} className="btn btn-circle btn-ghost btn-sm">
                                <FaPencil />
                            </Link>

                            <button className="btn btn-sm btn-circle btn-error btn-ghost text-error hover:text-white" onClick={() => handleOnClickDelete(101)}>
                                <FaTrash />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <Pagination
            hasNext={false}
            hasPrev={false} />

        <ConfirmationModal
            {...confirmationModal} />
    </>
}

export default Table