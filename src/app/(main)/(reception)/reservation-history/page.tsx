import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"

export const metadata: Metadata = {
    title: "Riwayat Pemesanan"
}

const Header = dynamic(() => import('@/components/header'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const Table = dynamic(() => import('./components/table'))
const Error = dynamic(() => import('@/components/error'))

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const searchParam = await searchParams
    const response = await GET({ searchParams: searchParam })
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main>
        <Header
            title="Riwayat Pemesanan"
            breadcrumbs={[
                { text: "Reception" },
                { text: "Riwayat Pemesanan" }
            ]} />

        <div className="mt-5 bg-white card shadow">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            Riwayat Pemesanan Hotel
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Daftar lengkap semua pemesanan yang sudah dibayar dengan detail booking dan status
                        </p>
                    </div>
                    <SearchInput
                        label="Cari nama tamu"
                        placeholder="Nama tamu atau email..." />
                </div>
            </div>
        </div>

        <div className="mt-5 bg-white card shadow">
            <div className="card-body">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Total Pemesanan
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Menampilkan semua pemesanan yang sudah lunas
                        </p>
                    </div>
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Total Record</div>
                            <div className="stat-value text-primary">{response.data?.booking.length || 0}</div>
                            <div className="stat-desc">Pemesanan</div>
                        </div>
                    </div>
                </div>
                <Table response={response.data!} />
            </div>
        </div>
    </main>
}

export default page