import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"

export const metadata: Metadata = {
    title: "Daftar Tamu Check-Out"
}

const SearchInput = dynamic(() => import('@/components/searchInput'))
const Header = dynamic(() => import('@/components/header'))
const Table = dynamic(() => import('./components/table'))
const Error = dynamic(() => import('@/components/error'))

const page = async({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const searchParam = await searchParams
    const response = await GET({ searchParams: searchParam })
    if(response.name === "SERVER_ERROR"){
        return <Error message={response.message!} />
    }

    return <main>
        <Header
            title="Daftar Tamu Check-Out"
            breadcrumbs={[
                { text: "Reception" },
                { text: "Check-Out" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            Manajemen Check-Out Tamu
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Kelola proses check-out tamu yang sedang menginap dengan informasi booking lengkap
                        </p>
                    </div>
                    <SearchInput
                        label="Cari nama tamu"
                        placeholder="Nama tamu..." />
                </div>
            </div>
        </div>

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Table response={response.data!} />
            </div>
        </div>
    </main>
}

export default page