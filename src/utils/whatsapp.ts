import { converToRupiah } from "./utils"

export interface WhatsAppMessage {
    target: string // phone|name format
    message: string
    image?: string // base64 image for attachment
}

export interface BookingDetails {
    bookingId: string
    userName: string
    userPhone: string
    roomCategoryName: string
    checkInDate: string // New: check-in date
    checkOutDate: string // New: check-out date
    nights: number // New: number of nights
    bookingDate: string // Deprecated: for backward compatibility
    price: number // Total price for all nights
    pricePerNight?: number // New: price per night
    paymentMethod?: string
    transactionId?: string
    checkInTime?: string
    checkOutTime?: string
}

/**
 * Send WhatsApp message via Fonnte API
 */
export const sendWhatsAppMessage = async (data: WhatsAppMessage): Promise<boolean> => {
    try {
        const headers = new Headers()
        headers.append("Authorization", process.env.FONNTE_API!)

        const formData = new FormData()
        formData.append("target", data.target)
        formData.append("message", data.message)
        
        if (data.image) {
            formData.append("file", data.image)
        }

        const response = await fetch(`https://api.fonnte.com/send`, {
            headers: headers,
            method: "POST",
            body: formData,
            redirect: "follow"
        })

        const result = await response.json()
        return response.ok && result.status

    } catch (error) {
        console.error("WhatsApp send error:", error)
        return false
    }
}

/**
 * Generate payment success message template
 */
export const generatePaymentSuccessMessage = (booking: BookingDetails): string => {
    const header = "🎉 *PEMBAYARAN BERHASIL - PINANGSIA STAY*"
    const thankYou = "Terima kasih atas pembayaran Anda!"
    
    // Use date range or fallback to single date
    const stayDuration = booking.nights > 1 
        ? `${booking.nights} malam (${booking.checkInDate} - ${booking.checkOutDate})`
        : booking.checkInDate || booking.bookingDate
    
    const bookingDetails = [
        "📋 *DETAIL BOOKING:*",
        "• Booking ID: " + booking.bookingId,
        "• Nama: " + booking.userName,
        "• Tipe Kamar: " + booking.roomCategoryName,
        "• Check-in: " + (booking.checkInDate || booking.bookingDate),
        "• Check-out: " + (booking.checkOutDate || 'Hari berikutnya'),
        "• Durasi: " + (booking.nights ? booking.nights + " malam" : "1 malam"),
        booking.pricePerNight && booking.nights > 1 
            ? "• Harga per malam: " + converToRupiah(booking.pricePerNight)
            : '',
        "• Total Bayar: " + converToRupiah(booking.price),
        booking.transactionId ? "• Transaction ID: " + booking.transactionId : ''
    ].filter(Boolean).join("\n")
    
    const status = "✅ *STATUS:* LUNAS"
    
    const nextSteps = [
        "📱 *LANGKAH SELANJUTNYA:*",
        "1. Simpan pesan ini sebagai bukti pembayaran",
        "2. Datang ke hotel pada tanggal check-in",
        "3. Tunjukkan pesan ini di reception",
        "4. Check-in: " + (booking.checkInTime || '14:00 WIB'),
        "5. Check-out: " + (booking.checkOutTime || '12:00 WIB')
    ].join("\n")
    
    const hotelInfo = [
        "🏨 *PINANGSIA STAY*",
        "Jl. Pinangsia Raya, Jakarta",
        "📞 Hubungi kami: +62 21 xxx-xxxx"
    ].join("\n")
    
    const closing = booking.nights > 1 
        ? `Terima kasih telah memilih Pinangsia Stay untuk ${booking.nights} malam! 🙏`
        : "Terima kasih telah memilih Pinangsia Stay! 🙏"
    
    return [
        header,
        "",
        thankYou,
        "",
        bookingDetails,
        "",
        status,
        "",
        nextSteps,
        "",
        hotelInfo,
        "",
        closing
    ].join("\n")
}

/**
 * Generate booking reminder message
 */
export const generateBookingReminderMessage = (booking: BookingDetails): string => {
    const header = "🔔 *REMINDER CHECK-IN - PINANGSIA STAY*"
    const greeting = "Halo " + booking.userName + "! 👋"
    const reminder = "Kami ingatkan bahwa Anda memiliki reservasi hari ini:"
    
    const bookingDetails = [
        "📋 *DETAIL BOOKING:*",
        "• Booking ID: " + booking.bookingId,
        "• Tipe Kamar: " + booking.roomCategoryName,
        "• Check-in: " + (booking.checkInDate || booking.bookingDate),
        "• Check-out: " + (booking.checkOutDate || 'Sesuai durasi booking'),
        booking.nights ? "• Durasi: " + booking.nights + " malam" : '',
        "• Waktu Check-in: " + (booking.checkInTime || '14:00') + " WIB"
    ].filter(Boolean).join("\n")
    
    const hotelAddress = [
        "📍 *ALAMAT HOTEL:*",
        "Pinangsia Stay",
        "Jl. Pinangsia Raya, Jakarta"
    ].join("\n")
    
    const closing = "Sampai jumpa di hotel! 🏨✨"
    
    return [
        header,
        "",
        greeting,
        "",
        reminder,
        "",
        bookingDetails,
        "",
        hotelAddress,
        "",
        closing
    ].join("\n")
}

/**
 * Generate check-in success message
 */
export const generateCheckInSuccessMessage = (booking: BookingDetails & { roomNumber: string }): string => {
    const header = "🎉 *CHECK-IN BERHASIL - PINANGSIA STAY*"
    const welcome = "Selamat datang " + booking.userName + "!"
    
    const roomDetails = [
        "🏨 *DETAIL KAMAR ANDA:*",
        "• Booking ID: " + booking.bookingId,
        "• Nomor Kamar: " + booking.roomNumber,
        "• Tipe Kamar: " + booking.roomCategoryName,
        "• Check-out: " + (booking.checkOutTime || 'Besok 12:00') + " WIB"
    ].join("\n")
    
    const importantInfo = [
        "🔑 *INFORMASI PENTING:*",
        "• WiFi: Pinangsia-Stay (password di kartu kamar)",
        "• Breakfast: 06:00 - 10:00 WIB (Lantai 1)",
        "• Room Service: 24 jam",
        "• Check-out maksimal: 12:00 WIB"
    ].join("\n")
    
    const closing = "Selamat beristirahat dan nikmati pengalaman menginap Anda! 😊🛏️"
    
    return [
        header,
        "",
        welcome,
        "",
        roomDetails,
        "",
        importantInfo,
        "",
        closing
    ].join("\n")
}

/**
 * Generate booking cancellation message
 */
export const generateCancellationMessage = (booking: BookingDetails): string => {
    const header = "❌ *PEMBATALAN BOOKING - PINANGSIA STAY*"
    const greeting = "Halo " + booking.userName + ","
    const announcement = "Booking Anda telah dibatalkan:"
    
    const bookingDetails = [
        "📋 *DETAIL BOOKING:*",
        "• Booking ID: " + booking.bookingId,
        "• Tipe Kamar: " + booking.roomCategoryName,
        "• Check-in: " + (booking.checkInDate || booking.bookingDate),
        "• Check-out: " + (booking.checkOutDate || 'Sesuai durasi booking'),
        booking.nights ? "• Durasi: " + booking.nights + " malam" : ''
    ].filter(Boolean).join("\n")
    
    const refundInfo = [
        "💰 *REFUND:*",
        "Proses refund akan diproses dalam 3-5 hari kerja ke rekening yang sama."
    ].join("\n")
    
    const supportInfo = [
        "📞 *BANTUAN:*",
        "Jika ada pertanyaan, hubungi kami di +62 21 xxx-xxxx"
    ].join("\n")
    
    const closing = "Terima kasih atas pengertian Anda. 🙏"
    
    return [
        header,
        "",
        greeting,
        "",
        announcement,
        "",
        bookingDetails,
        "",
        refundInfo,
        "",
        supportInfo,
        "",
        closing
    ].join("\n")
}
