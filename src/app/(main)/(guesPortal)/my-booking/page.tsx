import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"
import { formatDate } from "@/utils/moment"

export const metadata: Metadata = {
    title: "Pemesanan saya"
}

const Header = dynamic(() => import('@/components/header'))
const Error = dynamic(() => import('@/components/error'))
const Pagination = dynamic(() => import('@/components/pagination'))

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const response = await GET({ searchParams })
    if (response.name != "SUCCESS") {
        return <Error message={response.name} />
    }

    return <main>
        <Header
            title="Pemesanan Saya"
            breadcrumbs={[
                { text: "Daftar Pemesanan Saya" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">

            </div>
        </div>

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Nomor Pesanan</th>
                            <th>Kategori Kamar</th>
                            <th>Nomor Kamar</th>
                            <th>Waktu Check In</th>
                            <th>Waktu Check Out</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            response.data!.booking.map((e, index) => <tr key={index}>
                                <td>{ e.id }</td>
                                <td>{ e.roomCategory.name }</td>
                                <td>{ e.roomAllocation ? e.roomAllocation.roomId : "Anda belum melakukan Check-In" }</td>
                                <td>{ e.roomAllocation ? formatDate(e.roomAllocation.checkIn, "DD MMMM YYYY HH:mm") : "Anda belum melakukan Check-In" }</td>
                                <td>{ e.roomAllocation ? e.roomAllocation.checkOut ? formatDate(e.roomAllocation.checkOut, "DD MMMM YYYY HH:mm") : "-" : "Anda belum melakukan Check-In" }</td>
                            </tr>)
                        }
                    </tbody>
                </table>

                <Pagination
                    hasNext={response.data!.pagination.nextPage != null}
                    hasPrev={response.data!.pagination.previousPage != null} />
            </div>
        </div>
    </main>
}

export default page