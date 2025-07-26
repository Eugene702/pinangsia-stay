"use client"

import { GetResponseType, ReportSummary as SummaryType } from "../action"

interface ReportSummaryProps {
    data: GetResponseType
}

const ReportSummary = ({ data }: ReportSummaryProps) => {
    // Type guard to check if data has the expected structure
    const hasValidData = data.name === "SUCCESS" && data.data

    const formatCurrency = (amount: bigint | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(amount))
    }

    if (!hasValidData) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Pemesanan</div>
                        <div className="stat-value">-</div>
                    </div>
                </div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Pendapatan</div>
                        <div className="stat-value">-</div>
                    </div>
                </div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Booking Aktif</div>
                        <div className="stat-value">-</div>
                    </div>
                </div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Booking Selesai</div>
                        <div className="stat-value">-</div>
                    </div>
                </div>
            </div>
        )
    }

    const summary = data.data!.summary

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Pemesanan */}
            <div className="stat bg-white shadow rounded-lg">
                <div className="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <div className="stat-title text-gray-600">Total Pemesanan</div>
                <div className="stat-value text-primary">{summary.totalBookings}</div>
                <div className="stat-desc text-gray-500">Semua pemesanan</div>
            </div>

            {/* Total Pendapatan */}
            <div className="stat bg-white shadow rounded-lg">
                <div className="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                </div>
                <div className="stat-title text-gray-600">Total Pendapatan</div>
                <div className="stat-value text-secondary text-xl lg:text-2xl">{formatCurrency(summary.totalRevenue)}</div>
                <div className="stat-desc text-gray-500">Dari pemesanan terbayar</div>
            </div>

            {/* Tamu Check In */}
            <div className="stat bg-white shadow rounded-lg">
                <div className="stat-figure text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                </div>
                <div className="stat-title text-gray-600">Booking Aktif</div>
                <div className="stat-value text-success">{summary.activeBookings}</div>
                <div className="stat-desc text-gray-500">Sedang menginap</div>
            </div>

            {/* Tamu Check Out */}
            <div className="stat bg-white shadow rounded-lg">
                <div className="stat-figure text-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div className="stat-title text-gray-600">Booking Selesai</div>
                <div className="stat-value text-info">{summary.completedBookings}</div>
                <div className="stat-desc text-gray-500">Sudah check out</div>
            </div>
        </div>
    )
}

export default ReportSummary
