"use client"

import dynamic from "next/dynamic"
import { GetResponseType } from "../action"
import { converToRupiah } from "@/utils/utils"

const Pagination = dynamic(() => import('@/components/pagination'))
const Table = ({ response }: { response: GetResponseType }) => {
    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Nomor Pemesanan</th>
                    <th>Nama Tamu</th>
                    <th>Kategori Kamar</th>
                    <th>Total Harga</th>
                </tr>
            </thead>
            <tbody>
                {
                    response.booking.map((e, index) => <tr key={index}>
                        <td>{ e.id }</td>
                        <td>{ e.user.name }</td>
                        <td>{ e.roomCategory.name }</td>
                        <td>{ converToRupiah(Number(e.roomCategory.price)) }</td>
                    </tr>)
                }
            </tbody>
        </table>

        <Pagination
            hasNext={response.pagination.nextPage != null}
            hasPrev={response.pagination.previousPage != null} />
    </>
}

export default Table