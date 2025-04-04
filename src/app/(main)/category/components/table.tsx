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
        isOpen: false,
        title: "",
        message: "",
        isLoading: false,
        onClose: () => setConfirmationModal(prev => ({...prev, isOpen: false, isLoading: false})),
        onConfirm: () => {}
    })

    const handleOnClickDelete = (index: number) => {
        setConfirmationModal(prev => ({
            ...prev,
            isOpen: true,
            title: "Hapus Kategori Kamar",
            message: `Apakah kamu yakin ingin menghapus kategori kamar ${index}?`,
            isLoading: false,
            onConfirm: () => handleOnConfirmDelete(index)
        }))
    }

    const handleOnConfirmDelete = (index: number) => {
        
    }

    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Foto</th>
                    <th>Nama Kategori</th>
                    <th>Harga</th>
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
                    <td>Super</td>
                    <td>Rp. 200.000,00</td>
                    <td>
                        <div className="flex items-center gap-2">
                            <div className="tooltip" data-tip="Edit Kategori Kamar">
                                <Link href={`/category/asas`} className="btn btn-circle btn-sm btn-ghost">
                                    <FaPencil />
                                </Link>
                            </div>

                            <div className="tooltip" data-tip="Hapus Kategori Kamar">
                                <button className="btn btn-circle btn-error btn-sm btn-ghost text-error hover:text-white" onClick={() => handleOnClickDelete(1)}>
                                    <FaTrash />
                                </button>
                            </div>
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