"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { converToRupiah } from "@/utils/utils"
import { getDashboardChartData } from "../action"

interface DashboardContentProps {
    initialData: {
        room: number
        roomCategory: number
        user: number
        balance: { balance: number }
        bookingStats: {
            totalBookings: number
            totalRevenue: number
        }
        chartData: {
            recentBookings: any[]
            roomCategoryStats: {
                name: string
                bookingCount: number
                totalRevenue: number
            }[]
        }
    }
}

type FilterPeriod = "day" | "week" | "month" | "year"

const DashboardContent = ({ initialData }: DashboardContentProps) => {
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("month")
    const [chartData, setChartData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const loadChartData = async (period: FilterPeriod) => {
        setLoading(true)
        try {
            const response = await getDashboardChartData(period)
            if (response.name === "SUCCESS") {
                setChartData(response.data)
            }
        } catch (error) {
            console.error("Error loading chart data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadChartData(filterPeriod)
    }, [filterPeriod])

    const COLORS = ['#dc2626', '#ea580c', '#d97706', '#ca8a04']

    // Process booking trends for chart
    const processBookingTrends = () => {
        const bookingsByDate: { [key: string]: number } = {}
        
        // Initialize last 30 days with 0
        for (let i = 29; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })
            bookingsByDate[dateStr] = 0
        }
        
        // Count bookings by date
        initialData.chartData.recentBookings.forEach(booking => {
            const date = new Date(booking.bookingTime)
            const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })
            if (bookingsByDate.hasOwnProperty(dateStr)) {
                bookingsByDate[dateStr]++
            }
        })

        return Object.entries(bookingsByDate).map(([date, count]) => ({
            date,
            count
        }))
    }

    const statsCards = [
        {
            title: "Total Kamar",
            value: initialData.room,
            description: "Jumlah semua kamar",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: "from-blue-500 to-blue-600"
        },
        {
            title: "Total Booking",
            value: initialData.bookingStats.totalBookings,
            description: "Pemesanan berhasil",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            color: "from-green-500 to-green-600"
        },
        {
            title: "Total Revenue",
            value: converToRupiah(initialData.bookingStats.totalRevenue),
            description: "Pendapatan total",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            color: "from-emerald-500 to-emerald-600"
        },
        {
            title: "Saldo Xendit",
            value: converToRupiah(initialData.balance.balance),
            description: "Total uang di Xendit",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            color: "from-amber-500 to-amber-600"
        }
    ]

    const filterOptions = [
        { value: "day", label: "Harian", icon: "📅" },
        { value: "week", label: "Mingguan", icon: "📊" },
        { value: "month", label: "Bulanan", icon: "📈" },
        { value: "year", label: "Tahunan", icon: "📆" }
    ]

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <div key={index} className="group">
                        <div className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    <p className="text-white/70 text-xs mt-1">{stat.description}</p>
                                </div>
                                <div className="text-white/30 group-hover:text-white/50 transition-colors">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                {/* Info Alert */}
                <div className="alert alert-info mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 className="font-bold">Status Data Dashboard</h3>
                        <div className="text-xs mt-1">
                            <span className="badge badge-success badge-sm mr-2">Data Real</span>
                            Kategori Kamar, User Registrations (dari database) 
                            <span className="mx-2">•</span>
                            <span className="badge badge-error badge-sm mr-2">Belum Ada</span>
                            Revenue (butuh sistem transaksi)
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Analitik Data Real</h3>
                        <p className="text-gray-500 text-sm">Grafik data dari database berdasarkan periode waktu</p>
                    </div>
                    
                    <div className="flex gap-2">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilterPeriod(option.value as FilterPeriod)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                    filterPeriod === option.value
                                        ? "bg-primary text-white shadow-lg scale-105"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <span>{option.icon}</span>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-80">
                        <div className="flex flex-col items-center gap-4">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="text-gray-500">Memuat data grafik...</p>
                        </div>
                    </div>
                ) : chartData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bar Chart - User Registrations */}
                        <div className="bg-gray-50 rounded-xl p-4 relative">
                            <div className="absolute top-2 right-2">
                                <div className="badge badge-success badge-sm">Data Real</div>
                            </div>
                            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                Registrasi User {filterOptions.find(f => f.value === filterPeriod)?.label}
                            </h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={chartData.reservations}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="period" stroke="#666" fontSize={12} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        formatter={(value: any) => [value, 'Jumlah User']}
                                    />
                                    <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Line Chart - Revenue */}
                        <div className="bg-gray-50 rounded-xl p-4 relative">
                            <div className="absolute top-2 right-2">
                                <div className="badge badge-error badge-sm">Belum Ada</div>
                            </div>
                            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Pendapatan {filterOptions.find(f => f.value === filterPeriod)?.label}
                            </h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={chartData.revenue}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="period" stroke="#666" fontSize={12} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        formatter={(value: any) => [converToRupiah(value), 'Pendapatan']}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#10b981" 
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart - Room Categories */}
                        <div className="bg-gray-50 rounded-xl p-4 relative">
                            <div className="absolute top-2 right-2">
                                <div className="badge badge-success badge-sm">Data Real</div>
                            </div>
                            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                                Kategori Kamar (Jumlah Kamar)
                            </h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={chartData.roomCategories}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="count"
                                        label={({ name, percent }: any) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                        labelLine={false}
                                    >
                                        {chartData.roomCategories.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Area Chart - User Activity */}
                        <div className="bg-gray-50 rounded-xl p-4 relative">
                            <div className="absolute top-2 right-2">
                                <div className="badge badge-success badge-sm">Data Real</div>
                            </div>
                            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Aktivitas User {filterOptions.find(f => f.value === filterPeriod)?.label}
                            </h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={chartData.checkins}>
                                    <defs>
                                        <linearGradient id="colorCheckin" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="period" stroke="#666" fontSize={12} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        formatter={(value: any) => [value, 'Jumlah User']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="count" 
                                        stroke="#3b82f6" 
                                        fillOpacity={1} 
                                        fill="url(#colorCheckin)" 
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Booking Trends Chart */}
                        <div className="bg-gray-50 rounded-xl p-4 relative">
                            <div className="absolute top-2 right-2">
                                <div className="badge badge-success badge-sm">Data Real</div>
                            </div>
                            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Trend Booking (30 Hari Terakhir)
                            </h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={processBookingTrends()}>
                                    <defs>
                                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" stroke="#666" fontSize={12} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        formatter={(value: any) => [value, 'Jumlah Booking']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#dc2626"
                                        fillOpacity={1}
                                        fill="url(#colorBookings)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Room Category Performance */}
                        <div className="bg-gray-50 rounded-xl p-4 relative">
                            <div className="absolute top-2 right-2">
                                <div className="badge badge-success badge-sm">Data Real</div>
                            </div>
                            <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                </svg>
                                Booking per Kategori Kamar
                            </h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={initialData.chartData.roomCategoryStats}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="bookingCount"
                                        label={({ name, value }: any) => `${name}: ${value}`}
                                        labelLine={false}
                                    >
                                        {initialData.chartData.roomCategoryStats.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => [value, 'Jumlah Booking']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-80">
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a4 4 0 014-4h10a4 4 0 014 4v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
                            </svg>
                            <p className="text-gray-500">Tidak ada data grafik tersedia</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DashboardContent
