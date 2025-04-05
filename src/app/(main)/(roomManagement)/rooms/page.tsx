import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"

const Header = dynamic(() => import('@/components/header'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const Table = dynamic(() => import('./components/table'))

export const metadata: Metadata = {
    title: "Daftar Kamar"
}

const page = () => {
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
                <Table />
            </div>
        </div>
    </main>
}

export default page