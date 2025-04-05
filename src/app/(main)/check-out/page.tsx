import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
    title: "Daftar Tamu Check-Out"
}

const SearchInput = dynamic(() => import('@/components/searchInput'))
const Header = dynamic(() => import('@/components/header'))
const Table = dynamic(() => import('./components/table'))

const page = () => {
    return <main>
        <Header
            title="Daftar Tamu Check-Out"
            breadcrumbs={[
                { text: "Daftar Tamu Check-Out" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <div className="flex justify-between items-center">
                    <SearchInput
                        label="Cari nama tamu"
                        placeholder="Alvin" />
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