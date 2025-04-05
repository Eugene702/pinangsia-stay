"use client"

import dynamic from "next/dynamic"

const Pagination = dynamic(() => import('@/components/pagination'))
const Table = () => {
    return <>
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Nomor Pemesanan</th>
                    <th>Kategori Kamar</th>
                    <th>Total Pemesanan</th>
                    <th>Total Harga</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>123456789</td>
                    <td>Deluxe Room</td>
                    <td>2</td>
                    <td>Rp 1.000.000</td>
                    <td>
                        <button className="btn btn-primary btn-sm">Buat Invoice</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <Pagination
            hasNext={false}
            hasPrev={false} />
    </>
}

export default Table