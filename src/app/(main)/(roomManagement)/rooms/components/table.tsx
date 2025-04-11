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
                {
                    data.room.map((e, index) => <tr key={index}>
                        <th>
                            <div className="avatar">
                                <div className="mask mask-squircle w-24">
                                    <Image
                                        src={getCldImageUrl({ src: e.roomCategory.photo })}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        alt={`Foto Kategori Kamar ${e.roomCategory.name}`} />
                                </div>
                            </div>
                        </th>
                        <td>{ e.no }</td>
                        <td>{ e.roomCategory.name }</td>
                        <td>{ converToRupiah(Number(e.roomCategory.price)) }</td>
                        <td>{ e.floor }</td>
                        <td>
                            <div className="flex items-center gap-2">
                                <Link href={`/rooms/${e.no}`} className="btn btn-circle btn-ghost btn-sm">
                                    <FaPencil />
                                </Link>

                                <button className="btn btn-sm btn-circle btn-error btn-ghost text-error hover:text-white" onClick={() => handleOnClickDelete(e)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </td>
                    </tr>)
                }
            </tbody>
        </table>

        <Pagination
            hasNext={data.pagination.nextPage != null}
            hasPrev={data.pagination.previousPage != null} />

        <ConfirmationModal
            {...confirmationModal} />
    </>
}

export default Table