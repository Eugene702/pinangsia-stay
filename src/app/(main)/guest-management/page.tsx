import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { GET_PENDING_CHECKIN, GET_CURRENT_GUESTS } from "./action"

const Header = dynamic(() => import('@/components/header'))
const SearchInput = dynamic(() => import('@/components/searchInput'))
const CheckInTable = dynamic(() => import('./components/CheckInTable'))
const CheckOutTable = dynamic(() => import('./components/CheckOutTable'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Manajemen Tamu"
}

interface PageProps {
    searchParams: Promise<SearchParams & { tab?: string }>
}

const page = async ({ searchParams }: PageProps) => {
    const params = await searchParams
    const activeTab = params.tab || 'checkin'

    let checkInResponse = null
    let currentGuestsResponse = null

    if (activeTab === 'checkin') {
        checkInResponse = await GET_PENDING_CHECKIN({ searchParams: params })
        if (checkInResponse.name !== "SUCCESS") {
            return <Error message={checkInResponse.message!} />
        }
    }

    if (activeTab === 'checkout') {
        currentGuestsResponse = await GET_CURRENT_GUESTS({ searchParams: params })
        if (currentGuestsResponse.name !== "SUCCESS") {
            return <Error message={currentGuestsResponse.message!} />
        }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header
                title="Manajemen Tamu"
                breadcrumbs={[
                    { text: "Manajemen Tamu" }
                ]}
            />

            <div className="mt-6">
                <div className="card bg-white shadow">
                    <div className="card-body pb-0">
                        <div className="tabs tabs-bordered">
                            <Link 
                                href="/guest-management?tab=checkin" 
                                className={`tab tab-bordered ${activeTab === 'checkin' ? 'tab-active' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Check In Tamu
                                {checkInResponse?.data && (
                                    <div className="badge badge-primary badge-sm ml-2">
                                        {checkInResponse.data.bookings.length}
                                    </div>
                                )}
                            </Link>
                            <Link 
                                href="/guest-management?tab=checkout" 
                                className={`tab tab-bordered ${activeTab === 'checkout' ? 'tab-active' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Check Out Tamu
                                {currentGuestsResponse?.data && (
                                    <div className="badge badge-warning badge-sm ml-2">
                                        {currentGuestsResponse.data.allocations.length}
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 card bg-white shadow">
                <div className="card-body">
                    <div className="flex justify-between items-center">
                        <SearchInput
                            label={activeTab === 'checkin' ? "Cari tamu untuk check-in" : "Cari tamu yang sedang menginap"}
                            placeholder={activeTab === 'checkin' ? "Nama tamu..." : "Nama tamu atau nomor kamar..."}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 card bg-white shadow">
                <div className="card-body">
                    {activeTab === 'checkin' && checkInResponse?.data && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Tamu Menunggu Check-In
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Daftar tamu yang sudah melakukan pembayaran dan menunggu untuk check-in
                                    </p>
                                </div>
                                <div className="stats shadow">
                                    <div className="stat">
                                        <div className="stat-title">Total Menunggu</div>
                                        <div className="stat-value text-primary">{checkInResponse.data.bookings.length}</div>
                                        <div className="stat-desc">Tamu hari ini</div>
                                    </div>
                                </div>
                            </div>
                            <CheckInTable data={checkInResponse.data} />
                        </>
                    )}

                    {activeTab === 'checkout' && currentGuestsResponse?.data && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Tamu Sedang Menginap
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Daftar tamu yang sedang menginap dan siap untuk check-out
                                    </p>
                                </div>
                                <div className="stats shadow">
                                    <div className="stat">
                                        <div className="stat-title">Sedang Menginap</div>
                                        <div className="stat-value text-warning">{currentGuestsResponse.data.allocations.length}</div>
                                        <div className="stat-desc">Tamu aktif</div>
                                    </div>
                                </div>
                            </div>
                            <CheckOutTable data={currentGuestsResponse.data} />
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}

export default page
