import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"
import { GET } from "./action"

const Header = dynamic(() => import('@/components/header'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const Table = dynamic(() => import('./components/table'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Daftar Kamar"
}

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const searchParam = await searchParams
    const response = await GET(searchParam)
    if(response.name !== "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main>
        <Header
            title="Daftar Kamar"
            breadcrumbs={[
                { text: "Daftar Kamar" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <SearchInput
                        label="Cari Kamar"
                        placeholder="kamar 001" />

                    <Link href="/rooms/add" className="btn btn-outline btn-sm btn-primary">
                        <FaPlus />
                        <span>Tambah Kamar</span>
                    </Link>
                </div>
            </div>
        </div>

        <div className="mt-5 card bg -white shadow">
            <div className="card-body">
                <Table data={response.data!} />
            </div>
        </div>
    </main>
}

export default page