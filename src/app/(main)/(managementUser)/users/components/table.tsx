"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { FaTrash } from "react-icons/fa"
import { FaPencil } from "react-icons/fa6"
import { DELETE, GetPayload } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { showToast } from "@/utils/toast"

const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))
const Table = ({ data }: { data: GetPayload[] }) => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isOpen: false,
        title: "",
        isLoading: false,
        message: "",
        onConfirm: () => { },
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }))
    })

    const handleOnClickDeleteUser = (data: GetPayload) => {
        setConfirmationModal(prev => ({
            ...prev,
            isOpen: true,
            title: "Hapus Pengguna",
            message: `Apakah kamu yakin ingin menghapus pengguna ${data.name}?`,
            onConfirm: () => handleOnConfirmDeleteUser(data)
        }))
    }

    const handleOnConfirmDeleteUser = async (data: GetPayload) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        const response = await DELETE(data.id)
        if(response.name === "SUCCESS"){
            showToast("success", response.message)
        }else{
            showToast("error", response.message)
        }
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
                {
                    data.map((e, index) => <tr key={index}>
                        <td>
                            <div className="avatar">
                                <div className="mask mask-squircle w-24">
                                    <Image
                                        src={e.photo ? getCldImageUrl({ src: e.photo }) : "/images/logo.png"}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        alt={`Foto ${e.name}`} />
                                </div>
                            </div>
                        </td>
                        <td>{ e.name }</td>
                        <td>{ e.email }</td>
                        <td>{ e.telp }</td>
                        <td>{ e.address }</td>
                        <td>{ e.role === "CUSTOMER" ? "Tamu" : e.role === "RECIPIENT" ? "Resipsionis" : "Manajer" }</td>
                        <td>
                            <div className="flex items-center gap-2">
                                <div className="tooltip" data-tip="Edit Pengguna">
                                    <Link href={`/users/${e.id}`} className="btn btn-circle btn-sm btn-ghost">
                                        <FaPencil />
                                    </Link>
                                </div>

                                <div className="tooltip tooltip-left" data-tip="Hapus Pengguna">
                                    <button className="btn btn-circle btn-error btn-sm btn-ghost text-error hover:text-white" onClick={() => handleOnClickDeleteUser(e)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>)
                }
            </tbody>
        </table>

        <ConfirmationModal
            {...confirmationModal} />
    </>
}

export default Table