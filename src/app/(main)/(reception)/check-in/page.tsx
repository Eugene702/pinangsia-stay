import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"

const Header = dynamic(() => import('@/components/header'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const Table = dynamic(() => import('./components/table'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Tamu Check In"
}

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const response = await GET({ searchParams: await searchParams })
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

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
                <Table data={response.data!} />
            </div>
        </div>
    </main>
}

export default page