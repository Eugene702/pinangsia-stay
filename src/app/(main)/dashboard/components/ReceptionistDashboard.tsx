"use client"

import { converToRupiah } from "@/utils/utils"
import Link from "next/link"
import { FaUsers, FaBed, FaCalendarCheck, FaHistory } from "react-icons/fa"

interface ReceptionistDashboardProps {
    data: {
        totalBookings: number
        todayBookings: number
        availableRooms: number
        recentBookings: Array<{
            id: string
            bookingTime: Date
            user: {
                name: string
                email: string
            }
            roomCategory: {
                name: string
                price: bigint
            }
        }>
    }
}

const ReceptionistDashboard = ({ data }: ReceptionistDashboardProps) => {
    const stats = [
        {
            title: "Total Pemesanan",
            value: data.totalBookings,
            icon: <FaHistory className="w-8 h-8" />,
            bgColor: "bg-blue-500",
            textColor: "text-blue-600",
            bgLight: "bg-blue-50"
        },
        {
            title: "Pemesanan Hari Ini",
            value: data.todayBookings,
            icon: <FaCalendarCheck className="w-8 h-8" />,
            bgColor: "bg-green-500",
            textColor: "text-green-600",
            bgLight: "bg-green-50"
        },
        {
            title: "Kamar Tersedia",
            value: data.availableRooms,
            icon: <FaBed className="w-8 h-8" />,
            bgColor: "bg-purple-500",
            textColor: "text-purple-600",
            bgLight: "bg-purple-50"
        },
        {
            title: "Tamu Aktif",
            value: data.recentBookings.length,
            icon: <FaUsers className="w-8 h-8" />,
            bgColor: "bg-orange-500",
            textColor: "text-orange-600",
            bgLight: "bg-orange-50"
        }
    ]

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className={`${stat.bgLight} rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                                    {stat.value.toLocaleString()}
                                </p>
                            </div>
                            <div className={`${stat.bgColor} text-white p-3 rounded-xl shadow-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/guest-management" className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <FaUsers className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Kelola Tamu</span>
                    </Link>
                    <Link href="/reservation-history" className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                        <FaHistory className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Riwayat Pemesanan</span>
                    </Link>
                    <Link href="/check-in" className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        <FaCalendarCheck className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-800">Check In/Out</span>
                    </Link>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Pemesanan Terbaru</h3>
                    <Link href="/reservation-history" className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Lihat Semua
                    </Link>
                </div>
                
                {data.recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table table-sm">
                            <thead>
                                <tr className="border-gray-200">
                                    <th className="text-gray-600">Tamu</th>
                                    <th className="text-gray-600">Kategori Kamar</th>
                                    <th className="text-gray-600">Harga</th>
                                    <th className="text-gray-600">Waktu Pesan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentBookings.map((booking, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td>
                                            <div>
                                                <div className="font-semibold text-gray-800">{booking.user.name}</div>
                                                <div className="text-sm text-gray-500">{booking.user.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary badge-sm">{booking.roomCategory.name}</span>
                                        </td>
                                        <td className="font-semibold text-green-600">
                                            {converToRupiah(Number(booking.roomCategory.price))}
                                        </td>
                                        <td className="text-sm text-gray-600">
                                            {new Date(booking.bookingTime).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <FaHistory className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada pemesanan terbaru</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReceptionistDashboard
