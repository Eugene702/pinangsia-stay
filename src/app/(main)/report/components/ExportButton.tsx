"use client"

import { useState } from "react"
import { GetResponseType, BookingData } from "../action"

interface ExportButtonProps {
    data: GetResponseType
}

const ExportButton = ({ data }: ExportButtonProps) => {
    const [isExporting, setIsExporting] = useState(false)

    // Type guard to check if data has the expected structure
    const hasValidData = data.name === "SUCCESS" && data.data

    const formatCurrency = (amount: bigint) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(amount))
    }

    const formatDate = (date: Date, format: string = "DD/MM/YYYY HH:mm") => {
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: format.includes('HH') ? '2-digit' : undefined,
            minute: format.includes('mm') ? '2-digit' : undefined
        }).format(new Date(date))
    }

    const exportToCSV = () => {
        if (!hasValidData) {
            alert('Data tidak tersedia untuk diekspor')
            return
        }
        
        setIsExporting(true)
        
        try {
            const { bookings } = data.data!
            
            // Prepare CSV headers
            const headers = [
                'No. Pemesanan',
                'Nama Tamu',
                'Email Tamu',
                'Kategori Kamar',
                'No. Kamar',
                'Tanggal Booking',
                'Tanggal Check In',
                'Tanggal Check Out',
                'Total Harga',
                'Status Pembayaran',
                'Status Menginap'
            ]

            // Prepare CSV data
            const csvData = bookings.map((booking: BookingData) => {
                const getPaymentStatus = () => {
                    return booking.paidOff ? 'Sudah Bayar' : 'Belum Bayar'
                }

                const getStayStatus = () => {
                    if (booking.roomAllocation?.checkOut) return 'Check Out'
                    if (booking.roomAllocation?.checkIn) return 'Check In'
                    return 'Belum Check In'
                }

                return [
                    booking.id.slice(-8).toUpperCase(),
                    booking.user.name,
                    booking.user.email,
                    booking.roomCategory.name,
                    booking.roomAllocation?.room?.no || '-',
                    formatDate(booking.bookingTime, 'DD/MM/YYYY HH:mm'),
                    booking.roomAllocation?.checkIn ? formatDate(booking.roomAllocation.checkIn, 'DD/MM/YYYY HH:mm') : '-',
                    booking.roomAllocation?.checkOut ? formatDate(booking.roomAllocation.checkOut, 'DD/MM/YYYY HH:mm') : '-',
                    formatCurrency(booking.roomCategory.price),
                    getPaymentStatus(),
                    getStayStatus()
                ]
            })

            // Convert to CSV format
            const csvContent = [
                headers.join(','),
                ...csvData.map((row: any[]) => 
                    row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
                )
            ].join('\n')

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob)
                link.setAttribute('href', url)
                link.setAttribute('download', `laporan-pemesanan-${new Date().toISOString().split('T')[0]}.csv`)
                link.style.visibility = 'hidden'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            }
        } catch (error) {
            console.error('Error exporting CSV:', error)
            alert('Terjadi kesalahan saat mengekspor data')
        } finally {
            setIsExporting(false)
        }
    }

    const printReport = () => {
        if (!hasValidData) {
            alert('Data tidak tersedia untuk dicetak')
            return
        }
        
        setIsExporting(true)
        
        try {
            const { bookings, summary } = data.data!
            
            // Create print content
            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Laporan Pemesanan - Pinangsia Stay</title>
                    <style>
                        body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .header h1 { color: #dc2626; margin: 0; }
                        .header p { margin: 5px 0; }
                        .summary { margin-bottom: 30px; }
                        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
                        .summary-card { border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 8px; }
                        .summary-title { font-weight: bold; color: #666; }
                        .summary-value { font-size: 24px; font-weight: bold; color: #dc2626; margin: 10px 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; font-weight: bold; }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .status-paid { color: #10b981; font-weight: bold; }
                        .status-unpaid { color: #ef4444; font-weight: bold; }
                        .status-checkin { color: #3b82f6; font-weight: bold; }
                        .status-checkout { color: #10b981; font-weight: bold; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>PINANGSIA STAY</h1>
                        <h2>Laporan Pemesanan</h2>
                        <p>Dicetak pada: ${formatDate(new Date(), 'DD/MM/YYYY HH:mm')}</p>
                    </div>

                    <div class="summary">
                        <h3>Ringkasan</h3>
                        <div class="summary-grid">
                            <div class="summary-card">
                                <div class="summary-title">Total Pemesanan</div>
                                <div class="summary-value">${summary.totalBookings}</div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-title">Total Pendapatan</div>
                                <div class="summary-value">${formatCurrency(BigInt(summary.totalRevenue))}</div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-title">Booking Aktif</div>
                                <div class="summary-value">${summary.activeBookings}</div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-title">Booking Selesai</div>
                                <div class="summary-value">${summary.completedBookings}</div>
                            </div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>No. Pemesanan</th>
                                <th>Nama Tamu</th>
                                <th>Kategori Kamar</th>
                                <th>Tgl. Booking</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Total Harga</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bookings.map((booking: BookingData) => {
                                const getStatusClass = () => {
                                    if (booking.roomAllocation?.checkOut) return 'status-checkout'
                                    if (booking.roomAllocation?.checkIn) return 'status-checkin'
                                    if (booking.paidOff) return 'status-paid'
                                    return 'status-unpaid'
                                }

                                const getStatusText = () => {
                                    if (booking.roomAllocation?.checkOut) return 'Check Out'
                                    if (booking.roomAllocation?.checkIn) return 'Check In'
                                    if (booking.paidOff) return 'Sudah Bayar'
                                    return 'Belum Bayar'
                                }

                                return `
                                    <tr>
                                        <td class="text-center">${booking.id.slice(-8).toUpperCase()}</td>
                                        <td>${booking.user.name}</td>
                                        <td>${booking.roomCategory.name}</td>
                                        <td class="text-center">${formatDate(booking.bookingTime, 'DD/MM/YYYY')}</td>
                                        <td class="text-center">${booking.roomAllocation?.checkIn ? formatDate(booking.roomAllocation.checkIn, 'DD/MM/YYYY HH:mm') : '-'}</td>
                                        <td class="text-center">${booking.roomAllocation?.checkOut ? formatDate(booking.roomAllocation.checkOut, 'DD/MM/YYYY HH:mm') : '-'}</td>
                                        <td class="text-right">${formatCurrency(booking.roomCategory.price)}</td>
                                        <td class="text-center"><span class="${getStatusClass()}">${getStatusText()}</span></td>
                                    </tr>
                                `
                            }).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `

            // Open print window
            const printWindow = window.open('', '_blank')
            if (printWindow) {
                printWindow.document.write(printContent)
                printWindow.document.close()
                printWindow.focus()
                printWindow.print()
                printWindow.close()
            }
        } catch (error) {
            console.error('Error printing report:', error)
            alert('Terjadi kesalahan saat mencetak laporan')
        } finally {
            setIsExporting(false)
        }
    }

    if (!hasValidData) {
        return null
    }

    return (
        <div className="flex flex-wrap gap-2">
            <button 
                className={`btn btn-outline btn-success ${isExporting ? 'loading' : ''}`}
                onClick={exportToCSV}
                disabled={isExporting || (data.data?.bookings.length || 0) === 0}
            >
                {!isExporting && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )}
                {isExporting ? 'Mengekspor...' : 'Export CSV'}
            </button>

            <button 
                className={`btn btn-outline btn-primary ${isExporting ? 'loading' : ''}`}
                onClick={printReport}
                disabled={isExporting || (data.data?.bookings.length || 0) === 0}
            >
                {!isExporting && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                )}
                {isExporting ? 'Mencetak...' : 'Print'}
            </button>
        </div>
    )
}

export default ExportButton
