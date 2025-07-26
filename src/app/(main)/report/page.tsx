import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET, ReportSearchParams } from "./action"

// Dynamic imports for components
const Header = dynamic(() => import('@/components/header'))
const Error = dynamic(() => import('@/components/error'))
const ReportSummary = dynamic(() => import('./components/ReportSummary'))
const FilterSection = dynamic(() => import('./components/FilterSection'))
const ReportTable = dynamic(() => import('./components/ReportTable'))
const ExportButton = dynamic(() => import('./components/ExportButton'))

export const metadata: Metadata = {
    title: "Laporan Pemesanan"
}

interface PageProps {
    searchParams: Promise<ReportSearchParams>
}

const page = async ({ searchParams }: PageProps) => {
    const params = await searchParams
    const response = await GET({ searchParams: params })
    
    // Handle different error types gracefully
    if (response.name === "CONNECTION_POOL_ERROR") {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Sedang Sibuk</h3>
                    <p className="text-gray-600 mb-4">{response.message}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-primary"
                    >
                        Coba Lagi
                    </button>
                </div>
            </main>
        )
    }
    
    if (response.name === "TIMEOUT_ERROR") {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Query Timeout</h3>
                    <p className="text-gray-600 mb-4">{response.message}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="btn btn-warning"
                    >
                        Coba Lagi
                    </button>
                </div>
            </main>
        )
    }

    if (response.name !== "SUCCESS") {
        return <Error message={response.message!} />
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <Header
                title="Laporan Pemesanan"
                breadcrumbs={[
                    { text: "Laporan Pemesanan" }
                ]}
            />

            <div className="mt-6 space-y-6">
                {/* Summary Statistics */}
                <ReportSummary data={response} />

                {/* Filter Section */}
                <FilterSection />

                {/* Export Actions */}
                <div className="card bg-white shadow">
                    <div className="card-body">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Data Pemesanan
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Menampilkan {response.data?.bookings.length || 0} dari {response.data?.summary.totalBookings || 0} total pemesanan
                                </p>
                            </div>
                            <ExportButton data={response} />
                        </div>
                    </div>
                </div>

                {/* Report Table */}
                <ReportTable data={response} />
            </div>
        </main>
    )
}

export default page