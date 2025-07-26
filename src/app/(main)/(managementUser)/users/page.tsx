import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { FaPlus } from "react-icons/fa"
import { get } from "./action"

const Header = dynamic(() => import('@/components/header'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const Table = dynamic(() => import('./components/table'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Manajemen Pengguna"
}

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const { name, message, data } = await get({ searchParams: await searchParams })

    if(name === "SERVER_ERROR"){
        return <Error message={message!} />
    }

    return <main className="min-h-screen bg-gray-50">
        <Header
            title="Manajemen Pengguna"
            breadcrumbs={[
                { text: "Manajemen Pengguna" }
            ]} />

        <div className="mt-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-white">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Pengguna</div>
                    <div className="stat-value text-primary">{data![0].length}</div>
                    <div className="stat-desc">Pengguna terdaftar</div>
                </div>
                
                <div className="stat">
                    <div className="stat-figure text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Manajer</div>
                    <div className="stat-value text-success">
                        {data![0].filter(user => user.role === 'MANAGER').length}
                    </div>
                    <div className="stat-desc">Pengelola sistem</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Resepsionis</div>
                    <div className="stat-value text-info">
                        {data![0].filter(user => user.role === 'RECIPIENT').length}
                    </div>
                    <div className="stat-desc">Staff resepsionis</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">Pelanggan</div>
                    <div className="stat-value text-warning">
                        {data![0].filter(user => user.role === 'CUSTOMER').length}
                    </div>
                    <div className="stat-desc">Pengguna tamu</div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <div className="card bg-white shadow-lg border-0">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <SearchInput
                                label="Cari Pengguna"
                                placeholder="Nama, email, atau telepon..." />
                        </div>

                        <div className="flex gap-2">
                            <Link href="/users/add" className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                                <FaPlus className="text-sm" />
                                <span>Tambah Pengguna</span>
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
                        <Table data={data!} />
                    </div>
                </div>
            </div>
        </div>
    </main>
}

export default page