"use client"

import { ConfirmationModalProps } from "@/components/confirmationModal"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useState, Fragment } from "react"
import { FaTrash, FaEye } from "react-icons/fa"
import { FaPencil } from "react-icons/fa6"
import { DELETE, GetPayload } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { converToRupiah } from "@/utils/utils"

const Pagination = dynamic(() => import('@/components/pagination'))
const ConfirmationModal = dynamic(() => import('@/components/confirmationModal'))

const Table = ({ roomCategory }: { roomCategory: GetPayload }) => {
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalProps>({
        isOpen: false,
        title: "",
        message: "",
        isLoading: false,
        onClose: () => setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false })),
        onConfirm: () => { }
    })

    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

    const handleOnClickDelete = (item: GetPayload['0'][number]) => {
        setConfirmationModal(prev => ({
            ...prev,
            isOpen: true,
            title: "Hapus Kategori Kamar",
            message: `Apakah kamu yakin ingin menghapus kategori kamar ${item.name}?`,
            isLoading: false,
            onConfirm: () => handleOnConfirmDelete(item)
        }))
    }

    const handleOnConfirmDelete = async (item: GetPayload[0][number]) => {
        setConfirmationModal(prev => ({ ...prev, isLoading: true }))
        await DELETE(item.id)
        setConfirmationModal(prev => ({ ...prev, isLoading: false, isOpen: false }))
    }

    const toggleExpanded = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
    }

    return <>
        <div className="overflow-x-auto">
            <table className="table table-zebra table-pin-rows">
                <thead>
                    <tr className="bg-base-200">
                        <th className="text-center w-24">Foto</th>
                        <th>Kategori & Detail</th>
                        <th className="text-center">Harga</th>
                        <th className="text-center">Kamar</th>
                        <th className="text-center w-32">Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        roomCategory[0].map((e, index) => (
                            <Fragment key={e.id}>
                                <tr className="hover:bg-base-50 transition-colors">
                                    <td className="text-center">
                                        <div className="flex justify-center">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-16 h-16 shadow-md">
                                                    <Image
                                                        src={getCldImageUrl({ src: e.photo })}
                                                        width={64}
                                                        height={64}
                                                        alt={`Foto Kategori Kamar ${e.name}`}
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="space-y-1">
                                            <div className="font-bold text-lg text-gray-800">{e.name}</div>
                                            <div className="text-sm text-gray-500">
                                                Kategori kamar premium dengan fasilitas lengkap
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="badge badge-lg badge-primary font-semibold">
                                            {converToRupiah(Number(e.price))}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">per malam</div>
                                    </td>
                                    <td className="text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="stats stats-vertical bg-base-100 shadow-sm">
                                                <div className="stat py-2 px-4">
                                                    <div className="stat-title text-xs">Total</div>
                                                    <div className="stat-value text-lg text-primary">
                                                        {e.room?.length || 0}
                                                    </div>
                                                </div>
                                                <div className="stat py-2 px-4">
                                                    <div className="stat-title text-xs">Tersedia</div>
                                                    <div className="stat-value text-lg text-success">
                                                        {e.room?.filter(room => room.roomAvailability === null).length || 0}
                                                    </div>
                                                </div>
                                            </div>
                                            {e.room && e.room.length > 0 && (
                                                <button 
                                                    className="btn btn-xs btn-ghost gap-1 hover:btn-primary"
                                                    onClick={() => toggleExpanded(e.id)}
                                                    title="Lihat daftar kamar"
                                                >
                                                    <FaEye className="text-xs" />
                                                    Detail
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className="flex justify-center gap-1">
                                            <div className="tooltip" data-tip="Edit Kategori">
                                                <Link href={`/category/${e.id}`} className="btn btn-square btn-sm btn-ghost hover:btn-primary">
                                                    <FaPencil className="text-sm" />
                                                </Link>
                                            </div>

                                            <div className="tooltip" data-tip="Hapus Kategori">
                                                <button 
                                                    className="btn btn-square btn-sm btn-ghost hover:btn-error text-error" 
                                                    onClick={() => handleOnClickDelete(e)}
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                {expandedCategory === e.id && e.room && e.room.length > 0 && (
                                    <tr key={`${index}-expanded`}>
                                        <td colSpan={5} className="bg-base-100 p-0">
                                            <div className="p-6 border-l-4 border-primary">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-semibold text-lg text-primary flex items-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        Daftar Kamar - {e.name}
                                                    </h4>
                                                    <button 
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() => setExpandedCategory(null)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                    {e.room.map((room, roomIndex) => (
                                                        <div key={roomIndex} className="card bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                            <div className="card-body p-4">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <div className="font-bold text-gray-800">Kamar {room.no}</div>
                                                                        <div className="text-sm text-gray-500">
                                                                            Lantai {room.floor}
                                                                        </div>
                                                                    </div>
                                                                    <div className={`badge badge-sm ${
                                                                        room.roomAvailability === null 
                                                                            ? 'badge-success' 
                                                                            : 'badge-error'
                                                                    }`}>
                                                                        {room.roomAvailability === null ? 'Tersedia' : 'Terisi'}
                                                                    </div>
                                                                </div>
                                                                <div className="card-actions justify-end mt-3">
                                                                    <Link 
                                                                        href={`/rooms/${room.no}`}
                                                                        className="btn btn-xs btn-primary"
                                                                    >
                                                                        Detail
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))
                    }
                </tbody>
            </table>
        </div>

        <div className="mt-6 flex justify-center">
            <Pagination
                hasNext={roomCategory[1].nextPage != null}
                hasPrev={roomCategory[1].previousPage != null} />
        </div>

        <ConfirmationModal
            {...confirmationModal} />
    </>
}

export default Table