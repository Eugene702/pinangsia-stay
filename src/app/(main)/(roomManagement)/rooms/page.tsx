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

    return <main className="min-h-screen bg-gray-50">
        <Header
            title="Manajemen Kamar"
            breadcrumbs={[
                { text: "Manajemen Kamar" }
            ]} />

        <div className="mt-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-white">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Kamar</div>
                    <div className="stat-value text-primary">{response.data!.room.length}</div>
                    <div className="stat-desc">Kamar terdaftar</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Kamar Tersedia</div>
                    <div className="stat-value text-success">
                        {response.data!.room.filter(room => !room.roomAvailability).length}
                    </div>
                    <div className="stat-desc">Siap dihuni</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Kamar Terisi</div>
                    <div className="stat-value text-warning">
                        {response.data!.room.filter(room => room.roomAvailability).length}
                    </div>
                    <div className="stat-desc">Sedang digunakan</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Tingkat Okupansi</div>
                    <div className="stat-value text-info">
                        {response.data!.room.length > 0 ? Math.round((response.data!.room.filter(room => room.roomAvailability).length / response.data!.room.length) * 100) : 0}%
                    </div>
                    <div className="stat-desc">Kamar terpakai</div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <div className="card bg-white shadow-lg border-0">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <SearchInput
                                label="Cari Kamar"
                                placeholder="Nomor kamar, lantai, atau kategori..." />
                        </div>

                        <div className="flex gap-2">
                            <Link href="/category" className="btn btn-ghost gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Kategori
                            </Link>
                            <Link href="/rooms/add" className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                                <FaPlus className="text-sm" />
                                <span>Tambah Kamar</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <div className="card bg-white shadow-lg border-0">
                <div className="card-body p-0">
                    <div className="overflow-hidden">
                        <Table data={response.data!} />
                    </div>
                </div>
            </div>
        </div>
    </main>
}

export default page