"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { FaTrash } from "react-icons/fa"
import { FaPencil } from "react-icons/fa6"

const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))
const Table = () => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isOpen: false,
        title: "",
        isLoading: false,
        message: "",
        onConfirm: () => {},
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }))
    })

    const handleOnClickDeleteUser = (index: number) => {
        setConfirmationModal(prev => ({
            ...prev,
            isOpen: true,
            title: "Hapus Pengguna",
            message: `Apakah kamu yakin ingin menghapus pengguna ${index}?`,
            onConfirm: () => handleOnConfirmDeleteUser(index)
        }))
    }

    const handleOnConfirmDeleteUser = async (index: number) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setConfirmationModal(prev => ({ ...prev, isLoading: false, isOpen: false }))
    }

    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Foto</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Telp</th>
                    <th>Alamat</th>
                    <th>Posisi</th>
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
                    <td>Alvin</td>
                    <td>alvin@gmail.com</td>
                    <td>082xxx</td>
                    <td>Jl. Meneteng Atas</td>
                    <td>Tamu</td>
                    <td>
                        <div className="flex items-center gap-2">
                            <div className="tooltip" data-tip="Edit Pengguna">
                                <Link href={`/users/asas`} className="btn btn-circle btn-sm btn-ghost">
                                    <FaPencil />
                                </Link>
                            </div>

                            <div className="tooltip tooltip-left" data-tip="Hapus Pengguna">
                                <button className="btn btn-circle btn-error btn-sm btn-ghost text-error hover:text-white" onClick={() => handleOnClickDeleteUser(1)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <ConfirmationModal
            {...confirmationModal} />
    </>
}

export default Table