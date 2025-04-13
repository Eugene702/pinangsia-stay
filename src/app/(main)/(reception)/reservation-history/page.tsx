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
                { text: "Riwayat Pemesanan" }
            ]} />

        <div className="mt-5 bg-white card shadow">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <SearchInput
                        label="Cari nama tamu"
                        placeholder="Alvin" />
                </div>
            </div>
        </div>

        <div className="mt-5 bg-white card shadow">
            <div className="card-body">
                <Table response={response.data!} />
            </div>
        </div>
    </main>
}

export default page