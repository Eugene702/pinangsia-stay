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
                {
                    roomCategory[0].map((e, index) => <tr key={index}>
                        <td>
                            <div className="avatar">
                                <div className="mask mask-squircle w-24">
                                    <Image
                                        src={getCldImageUrl({ src: e.photo })}
                                        width={0}
                                        height={0}
                                        alt={`Foto Kategori Kamar ${e.name}`}
                                        sizes="100vw" />
                                </div>
                            </div>
                        </td>
                        <td>{ e.name }</td>
                        <td>{ converToRupiah(Number(e.price)) }</td>
                        <td>
                            <div className="flex items-center gap-2">
                                <div className="tooltip" data-tip="Edit Kategori Kamar">
                                    <Link href={`/category/${e.id}`} className="btn btn-circle btn-sm btn-ghost">
                                        <FaPencil />
                                    </Link>
                                </div>

                                <div className="tooltip" data-tip="Hapus Kategori Kamar">
                                    <button className="btn btn-circle btn-error btn-sm btn-ghost text-error hover:text-white" onClick={() => handleOnClickDelete(e)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>)
                }
            </tbody>
        </table>

        <Pagination
            hasNext={roomCategory[1].nextPage != null}
            hasPrev={roomCategory[1].previousPage != null} />

        <ConfirmationModal
            {...confirmationModal} />
    </>
}

export default Table