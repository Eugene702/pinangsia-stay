import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"
import { GET } from "./action"

const Header = dynamic(() => import("@/components/header"))
const SearchInput = dynamic(() => import("@/components/searchInput"))
const Table = dynamic(() => import('./components/table'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Daftar Kategori Kamar"
}

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const response = await GET({ searchParams: await searchParams })
    if(response.name === "SERVER_ERROR"){
        return <Error message={response.message!} />
    }

    return <main className="min-h-screen bg-gray-50">
        <Header
            title="Manajemen Kategori Kamar"
            breadcrumbs={[
                { text: "Manajemen Kamar", url: "/rooms" },
                { text: "Kategori Kamar" }
            ]} />

        <div className="mt-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-white">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Kategori</div>
                    <div className="stat-value text-primary">{response.data![0].length}</div>
                    <div className="stat-desc">Kategori kamar tersedia</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Kamar</div>
                    <div className="stat-value text-secondary">
                        {response.data![0].reduce((total, category) => total + (category.room?.length || 0), 0)}
                    </div>
                    <div className="stat-desc">Kamar dalam semua kategori</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-accent">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Kamar Tersedia</div>
                    <div className="stat-value text-accent">
                        {response.data![0].reduce((total, category) => 
                            total + (category.room?.filter(room => room.roomAvailability === null).length || 0), 0
                        )}
                    </div>
                    <div className="stat-desc">Siap untuk ditempati</div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <div className="card bg-white shadow-lg border-0">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <SearchInput
                                label="Cari kategori kamar"
                                placeholder="Masukkan nama kategori..." />
                        </div>

                        <div className="flex gap-2">
                            <Link href="/category/add" className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                                <FaPlus className="text-sm" />
                                <span>Tambah Kategori</span>
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
                        <Table roomCategory={response.data!} />
                    </div>
                </div>
            </div>
        </div>
    </main>
}

export default page