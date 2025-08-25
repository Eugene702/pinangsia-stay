"use client"

import dynamic from "next/dynamic"
import { GetResponseType } from "../action"
import { converToRupiah } from "@/utils/utils"
import { formatDate } from "@/utils/moment"
import moment from "moment-timezone"
import "moment/locale/id"

const Pagination = dynamic(() => import('@/components/pagination'))

// Utility functions
const calculateNights = (checkInDate: Date | string | null, checkOutDate: Date | string | null): number => {
    if (!checkInDate || !checkOutDate) return 1
    
    const checkIn = moment(checkInDate).startOf('day')
    const checkOut = moment(checkOutDate).startOf('day')
    const nights = checkOut.diff(checkIn, 'days')
    
    return nights > 0 ? nights : 1
}

const getBookingStatus = (booking: GetResponseType['booking'][number]) => {
    if (!booking.roomAllocation) {
        return { status: 'pending', label: 'Menunggu Check-in', color: 'badge-warning' }
    }
    
    if (booking.roomAllocation.checkOut) {
        return { status: 'completed', label: 'Selesai', color: 'badge-success' }
    }
    
    return { status: 'checkedin', label: 'Sedang Menginap', color: 'badge-info' }
}

const Table = ({ response }: { response: GetResponseType }) => {
    if (response.booking.length === 0) {
        return (
            <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Riwayat Pemesanan</h3>
                <p className="text-gray-500">Belum ada pemesanan yang tercatat dalam sistem.</p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th className="min-w-[150px]">Booking ID</th>
                            <th className="min-w-[200px]">Info Tamu</th>
                            <th className="min-w-[150px]">Kategori Kamar</th>
                            <th className="min-w-[120px]">Check-In</th>
                            <th className="min-w-[120px]">Check-Out</th>
                            <th className="min-w-[100px]">Durasi</th>
                            <th className="min-w-[120px]">Total Harga</th>
                            <th className="min-w-[100px]">Status</th>
                            <th className="min-w-[100px]">Kamar</th>
                            <th className="min-w-[120px]">Tanggal Booking</th>
                        </tr>
                    </thead>
                    <tbody>
                        {response.booking.map((booking, index) => {
                            const checkInDate = booking.checkInDate || booking.bookingTime
                            const checkOutDate = booking.checkOutDate
                            const nights = calculateNights(checkInDate, checkOutDate)
                            const totalPrice = Number(booking.roomCategory.price) * nights
                            const statusInfo = getBookingStatus(booking)
                            
                            return (
                                <tr key={index} className="hover">
                                    <td>
                                        <div className="font-mono text-sm">
                                            <div className="font-semibold">{booking.id.slice(-8)}</div>
                                            <div className="text-xs text-gray-500">#{booking.id}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div className="font-bold text-lg">{booking.user.name}</div>
                                            <div className="text-sm opacity-70">{booking.user.email}</div>
                                            {booking.user.telp && (
                                                <div className="text-sm opacity-70">{booking.user.telp}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div className="font-semibold">{booking.roomCategory.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {converToRupiah(Number(booking.roomCategory.price))}/malam
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div className="font-semibold">
                                                {formatDate(checkInDate, "DD MMM YYYY")}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div className="font-semibold">
                                                {checkOutDate 
                                                    ? formatDate(checkOutDate, "DD MMM YYYY")
                                                    : <span className="text-gray-500 italic">Tidak diset</span>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-center">
                                            <span className="badge badge-primary font-bold">
                                                {nights} malam
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-bold text-success text-lg">
                                            {converToRupiah(totalPrice)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${statusInfo.color} font-semibold`}>
                                            {statusInfo.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="text-center">
                                            {booking.roomAllocation?.room?.no ? (
                                                <span className="badge badge-outline badge-primary font-bold">
                                                    Kamar {booking.roomAllocation.room.no}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 italic text-sm">Belum dialokasi</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <div className="font-semibold">
                                                {formatDate(booking.createdAt, "DD MMM YYYY")}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(booking.createdAt, "HH:mm")}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <Pagination
                    hasNext={response.pagination.nextPage != null}
                    hasPrev={response.pagination.previousPage != null}
                />
            </div>
        </>
    )
}

export default Table