import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
    title: "Riwayat Pemesanan"
}

const Header = dynamic(() => import('@/components/header'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const Table = dynamic(() => import('./components/table'))

const page = () => {
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
                <Table />
            </div>
        </div>
    </main>
}

export default page