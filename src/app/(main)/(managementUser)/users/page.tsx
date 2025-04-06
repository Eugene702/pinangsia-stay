import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"
import { get } from "./action"

const Breadcrumbs = dynamic(() => import('@/components/breadcrumbs'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const Pagination = dynamic(() => import('@/components/pagination'))
const Table = dynamic(() => import('./components/table'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Daftar Pengguna",
}

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const { name, message, data } = await get({ searchParams })

    if(name === "SERVER_ERROR"){
        return <Error message={message!} />
    }

    return <main>
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Daftar Pengguna</h1>
            <Breadcrumbs
                item={[
                    { text: "Daftar Pengguna" }
                ]} />
        </div>

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <SearchInput
                        label="Cari pengguna"
                        placeholder="Alvin" />

                    <Link href="/users/add" className="btn btn-primary btn-sm btn-outline">
                        <FaPlus />
                        <span>Tambah Resipsionis</span>
                    </Link>
                </div>
            </div>
        </div>

        <div className="mt-5 card bgwhite shadow">
            <div className="card-body">
                <Table data={data![0]} />
                <Pagination
                    hasNext={data![1].nextPage != null}
                    hasPrev={data![1].previousPage != null} />
            </div>
        </div>
    </main>
}

export default page