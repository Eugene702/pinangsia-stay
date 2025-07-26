"use client"

import { GetResponseType, BookingData } from "../action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { formatDate } from "@/utils/moment"
import dynamic from "next/dynamic"

const Pagination = dynamic(() => import('@/components/pagination'))

interface ReportTableProps {
    data: GetResponseType
}

const ReportTable = ({ data }: ReportTableProps) => {
    // Type guard to check if data has the expected structure
    const hasValidData = data.name === "SUCCESS" && data.data

    const formatCurrency = (amount: bigint) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(amount))
    }

    const getStatusBadge = (booking: BookingData) => {
        if (booking.roomAllocation?.checkOut) {
            return <div className="badge badge-success gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Check Out
            </div>
        } else if (booking.roomAllocation?.checkIn) {
            return <div className="badge badge-info gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                </svg>
                Check In
            </div>
        } else if (booking.paidOff) {
            return <div className="badge badge-warning gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                </svg>
                Sudah Bayar
            </div>
        } else {
            return <div className="badge badge-error gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Belum Bayar
            </div>
        }
    }

    if (!hasValidData) {
        return (
            <div className="card bg-white shadow">
                <div className="card-body text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Data Tidak Tersedia</h3>
                    <p className="text-gray-500">Tidak dapat memuat data laporan saat ini.</p>
                </div>
            </div>
        )
    }

    const { bookings } = data.data!

    if (bookings.length === 0) {
        return (
            <div className="card bg-white shadow">
                <div className="card-body text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak Ada Data</h3>
                    <p className="text-gray-500">Tidak ada pemesanan yang ditemukan dengan filter yang dipilih.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="card bg-white shadow">
            <div className="card-body">
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th className="font-semibold">No. Pemesanan</th>
                                <th className="font-semibold">Nama Tamu</th>
                                <th className="font-semibold">Kategori Kamar</th>
                                <th className="font-semibold">Tanggal Menginap</th>
                                <th className="font-semibold">Check In</th>
                                <th className="font-semibold">Check Out</th>
                                <th className="font-semibold">Total Harga</th>
                                <th className="font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking: BookingData, index: number) => (
                                <tr key={index} className="hover">
                                    <td>
                                        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                            {booking.id.slice(-8).toUpperCase()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <Image
                                                        src="/images/logo.png"
                                                        width={48}
                                                        height={48}
                                                        alt={`Foto ${booking.user.name}`}
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{booking.user.name}</div>
                                                <div className="text-sm opacity-50">{booking.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-semibold">{booking.roomCategory.name}</div>
                                        {booking.roomAllocation?.room && (
                                            <div className="text-sm opacity-50">Kamar {booking.roomAllocation.room.no}</div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            {formatDate(booking.bookingTime, "DD MMM YYYY")}
                                        </div>
                                        <div className="text-xs opacity-50">
                                            {formatDate(booking.bookingTime, "HH:mm")}
                                        </div>
                                    </td>
                                    <td>
                                        {booking.roomAllocation?.checkIn ? (
                                            <div>
                                                <div className="text-sm font-medium text-success">
                                                    {formatDate(booking.roomAllocation.checkIn, "DD MMM YYYY")}
                                                </div>
                                                <div className="text-xs opacity-50">
                                                    {formatDate(booking.roomAllocation.checkIn, "HH:mm")}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500">-</div>
                                        )}
                                    </td>
                                    <td>
                                        {booking.roomAllocation?.checkOut ? (
                                            <div>
                                                <div className="text-sm font-medium text-info">
                                                    {formatDate(booking.roomAllocation.checkOut, "DD MMM YYYY")}
                                                </div>
                                                <div className="text-xs opacity-50">
                                                    {formatDate(booking.roomAllocation.checkOut, "HH:mm")}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500">-</div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="font-bold text-primary">
                                            {formatCurrency(booking.roomCategory.price)}
                                        </div>
                                        {booking.paidOff && (
                                            <div className="text-xs text-success">
                                                Dibayar {formatDate(booking.paidOff, "DD MMM YYYY")}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {getStatusBadge(booking)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ReportTable
