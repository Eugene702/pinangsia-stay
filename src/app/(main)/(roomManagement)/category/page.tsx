import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"

const Header = dynamic(() => import("@/components/header"))
const SearchInput = dynamic(() => import("@/components/searchInput"))
const Table = dynamic(() => import('./components/table'))

export const metadata: Metadata = {
    title: "Daftar Kategori Kamar"
}

const page = () => {
    return <main>
        <Header
            title="Daftar Kategori Kamar"
            breadcrumbs={[
                { text: "Daftar Kategori Kamar" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <SearchInput
                        label="Cari kategori kamar"
                        placeholder="Super..." />

                    <Link href="/category/add" className="btn btn-primary btn-outline btn-sm">
                        <FaPlus />
                        <span>Tambah Kategori Kamar</span>
                    </Link>
                </div>
            </div>
        </div>

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Table />
            </div>
        </div>
    </main>
}

export default page