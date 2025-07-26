"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { FaTrash } from "react-icons/fa"
import { FaPencil } from "react-icons/fa6"
import { DELETE, GetResponseType } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { converToRupiah } from "@/utils/utils"
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
        title: "",
    })

    const handleOnClickDelete = (data: GetResponseType['room'][number]) => {
        setConfirmationModal(prev => ({
            ...prev,
            title: "Hapus Kamar",
            message: `Apakah kamu yakin ingin menghapus kamar ${data.no}?`,
            isOpen: true,
            onConfirm: () => handleOnConfirmDeleteRooms(data),
        }))
    }

    const handleOnConfirmDeleteRooms = async (data: GetResponseType['room'][number]) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        const response = await DELETE(data.no)
        if(response.name === "SUCCESS"){
            showToast("success", response.message!)
        }else{
            showToast("error", response.message!)
        }

        setConfirmationModal(prev => ({ ...prev, isLoading: false, isOpen: false }))
    }

    return <>
        <div className="overflow-x-auto">
            <table className="table table-zebra table-pin-rows">
                <thead>
                    <tr className="bg-base-200">
                        <th className="text-center w-20">Foto</th>
                        <th>Detail Kamar</th>
                        <th className="text-center">Kategori</th>
                        <th className="text-center">Harga</th>
                        <th className="text-center">Status</th>
                        <th className="text-center w-32">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.room.map((e, index) => (
                            <tr key={index} className="hover:bg-base-50 transition-colors">
                                <td className="text-center">
                                    <div className="flex justify-center">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-16 h-16 shadow-md">
                                                <Image
                                                    src={getCldImageUrl({ src: e.roomCategory.photo })}
                                                    width={64}
                                                    height={64}
                                                    alt={`Foto Kategori Kamar ${e.roomCategory.name}`}
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="space-y-1">
                                        <div className="font-bold text-lg text-gray-800">Kamar {e.no}</div>
                                        <div className="text-sm text-gray-500">Lantai {e.floor}</div>
                                        <div className="text-xs text-gray-400">
                                            Ditambahkan: {new Date(e.createdAt).toLocaleDateString('id-ID')}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="badge badge-lg badge-outline font-medium">
                                        {e.roomCategory.name}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="badge badge-lg badge-primary font-semibold">
                                        {converToRupiah(Number(e.roomCategory.price))}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">per malam</div>
                                </td>
                                <td className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`badge badge-sm ${
                                            !e.roomAvailability ? 'badge-success' : 'badge-warning'
                                        }`}>
                                            {!e.roomAvailability ? 'Tersedia' : 'Terisi'}
                                        </div>
                                        {e.roomAvailability && (
                                            <div className="text-xs text-gray-500">
                                                Tamu menginap
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="flex justify-center gap-1">
                                        <div className="tooltip" data-tip="Edit Kamar">
                                            <Link href={`/rooms/${e.no}`} className="btn btn-square btn-sm btn-ghost hover:btn-primary">
                                                <FaPencil className="text-sm" />
                                            </Link>
                                        </div>

                                        <div className="tooltip" data-tip="Hapus Kamar">
                                            <button 
                                                className="btn btn-square btn-sm btn-ghost hover:btn-error text-error" 
                                                onClick={() => handleOnClickDelete(e)}
                                                disabled={!!e.roomAvailability}
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
                hasNext={data.pagination.nextPage != null}
                hasPrev={data.pagination.previousPage != null} />
        </div>

        <ConfirmationModal
            {...confirmationModal} />
    </>
}

export default Table