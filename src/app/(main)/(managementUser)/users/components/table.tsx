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
import { PageNumberPagination } from "prisma-extension-pagination/dist/types"

const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))
const Pagination = dynamic(() => import('@/components/pagination'))

const Table = ({ data }: { data: [GetPayload[], PageNumberPagination] }) => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isOpen: false,
        title: "",
        isLoading: false,
        message: "",
        onConfirm: () => { },
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }))
    })

    const handleOnClickDeleteUser = (user: GetPayload) => {
        setConfirmationModal(prev => ({
            ...prev,
            isOpen: true,
            title: "Hapus Pengguna",
            message: `Apakah Anda yakin ingin menghapus pengguna "${user.name}"? Tindakan ini tidak dapat dibatalkan.`,
            onConfirm: () => handleOnConfirmDeleteUser(user)
        }))
    }

    const handleOnConfirmDeleteUser = async (user: GetPayload) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        const response = await DELETE(user.id)
        if(response.name === "SUCCESS"){
            showToast("success", response.message)
        }else{
            showToast("error", response.message)
        }
        setConfirmationModal(prev => ({ ...prev, isLoading: false, isOpen: false }))
    }

    const getRoleLabel = (role: string) => {
        switch(role) {
            case 'MANAGER': return 'Manajer'
            case 'RECIPIENT': return 'Resepsionis'
            case 'CUSTOMER': return 'Pelanggan'
            default: return role
        }
    }

    const getRoleBadge = (role: string) => {
        switch(role) {
            case 'MANAGER': return 'badge-success'
            case 'RECIPIENT': return 'badge-info'
            case 'CUSTOMER': return 'badge-warning'
            default: return 'badge-neutral'
        }
    }

    return <>
        <div className="overflow-x-auto">
            <table className="table table-lg">
                <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th className="text-left font-semibold text-gray-700">Pengguna</th>
                        <th className="text-left font-semibold text-gray-700">Kontak</th>
                        <th className="text-left font-semibold text-gray-700">Role</th>
                        <th className="text-center font-semibold text-gray-700">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        data[0].map((e, index) => (
                            <tr key={index} className="hover bg-gray-50/50 transition-colors">
                                <td>
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-16 h-16 shadow-md">
                                                <Image
                                                    src={e.photo ? getCldImageUrl({ src: e.photo }) : "/images/logo.png"}
                                                    width={64}
                                                    height={64}
                                                    alt={`Foto ${e.name}`}
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-bold text-lg text-gray-800">{e.name}</div>
                                            <div className="text-sm text-gray-500 max-w-xs truncate">
                                                {e.address || 'Alamat tidak tersedia'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                            <span className="text-sm text-gray-600">{e.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">{e.telp || 'Tidak ada telepon'}</span>
                                        </div>
                                        {e.role === 'CUSTOMER' && (
                                            <div className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                </svg>
                                                <span className="text-sm text-gray-600 font-mono">
                                                    {e.id.length === 16 ? e.id : 'NIK tidak tersedia'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`badge badge-sm ${getRoleBadge(e.role)}`}>
                                            {getRoleLabel(e.role)}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="flex justify-center gap-1">
                                        <div className="tooltip" data-tip="Edit Pengguna">
                                            <Link href={`/users/${e.id}`} className="btn btn-square btn-sm btn-ghost hover:btn-primary">
                                                <FaPencil className="text-sm" />
                                            </Link>
                                        </div>

                                        <div className="tooltip" data-tip="Hapus Pengguna">
                                            <button 
                                                className="btn btn-square btn-sm btn-ghost hover:btn-error text-error" 
                                                onClick={() => handleOnClickDeleteUser(e)}
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

        <div className="mt-6 flex justify-center">
            <Pagination
                hasNext={data[1].nextPage != null}
                hasPrev={data[1].previousPage != null} />
        </div>

        <ConfirmationModal
            {...confirmationModal} />
    </>
}

export default Table