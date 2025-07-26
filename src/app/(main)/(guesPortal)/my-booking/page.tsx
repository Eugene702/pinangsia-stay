import { SearchParams } from "@/types/global"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"
import { formatDate } from "@/utils/moment"

export const metadata: Metadata = {
    title: "My Bookings - Pinangsia Stay",
    description: "View and manage your hotel bookings"
}

const Error = dynamic(() => import('@/components/error'))
const Pagination = dynamic(() => import('@/components/pagination'))

const page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const searchParam = await searchParams
    const response = await GET({ searchParams: searchParam })
    if (response.name != "SUCCESS") {
        return <Error message={response.name} />
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center py-8 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-white shadow-lg">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    My Bookings
                </h1>
                <p className="text-xl text-red-100 max-w-2xl mx-auto">
                    Track and manage all your hotel reservations
                </p>
            </div>

            {/* Bookings Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {response.data!.booking.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't made any reservations yet. Start exploring our rooms!</p>
                        <a
                            href="/room-reservation"
                            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Browse Rooms
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Your Reservations</h2>
                                    <p className="text-sm text-gray-600">
                                        {response.data!.booking.length} booking{response.data!.booking.length === 1 ? '' : 's'} found
                                    </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Updated in real-time
                                </div>
                            </div>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Booking ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Room Category
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Room Number
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Check In
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Check Out
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {response.data!.booking.map((booking, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{booking.id.slice(-8).toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {booking.roomCategory.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {booking.roomAllocation?.room.no || "Not assigned"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {booking.roomAllocation?.checkIn ? formatDate(booking.roomAllocation.checkIn, 'DD MMM YYYY') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {booking.roomAllocation?.checkOut ? formatDate(booking.roomAllocation.checkOut, 'DD MMM YYYY') : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        booking.paidOff 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {booking.paidOff ? 'Confirmed' : 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden">
                            <div className="divide-y divide-gray-200">
                                {response.data!.booking.map((booking, index) => (
                                    <div key={index} className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                #{booking.id.slice(-8).toUpperCase()}
                                            </div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                booking.paidOff 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {booking.paidOff ? 'Confirmed' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Room Category:</span>
                                                <span className="text-sm font-medium text-gray-900">{booking.roomCategory.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Room Number:</span>
                                                <span className="text-sm text-gray-900">{booking.roomAllocation?.room.no || "Not assigned"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Check In:</span>
                                                <span className="text-sm text-gray-900">{booking.roomAllocation?.checkIn ? formatDate(booking.roomAllocation.checkIn, 'DD MMM YYYY') : '-'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Check Out:</span>
                                                <span className="text-sm text-gray-900">{booking.roomAllocation?.checkOut ? formatDate(booking.roomAllocation.checkOut, 'DD MMM YYYY') : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <Pagination 
                                hasNext={response.data!.pagination.nextPage != null}
                                hasPrev={response.data!.pagination.previousPage != null} 
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default page