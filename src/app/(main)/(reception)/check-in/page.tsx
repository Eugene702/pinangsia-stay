import { Metadata } from "next"
import dynamic from "next/dynamic"

const Header = dynamic(() => import('@/components/header'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const Table = dynamic(() => import('./components/table'))

export const metadata: Metadata = {
    title: "Tamu Check In"
}

const page = () => {
    return <main>
        <Header
            title="Tamu Check In"
            breadcrumbs={[
                { text: "Tamu Check In" }
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