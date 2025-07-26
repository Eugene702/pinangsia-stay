import moment from "moment-timezone"

export type BookingStatus = 'ACTIVE' | 'EXPIRED'

/**
 * Get booking status based on booking date vs current date
 */
export const getBookingStatus = (bookingTime: Date): BookingStatus => {
    const today = moment().startOf('day')
    const bookingDate = moment(bookingTime).startOf('day')
    
    if (bookingDate.isSame(today, 'day')) {
        return 'ACTIVE'
    } else if (bookingDate.isBefore(today, 'day')) {
        return 'EXPIRED'
    }
    
    return 'EXPIRED' // Default fallback
}

/**
 * Check if booking can be checked in (only today's bookings)
 */
export const canCheckIn = (bookingTime: Date): boolean => {
    return getBookingStatus(bookingTime) === 'ACTIVE'
}

/**
 * Get status badge styling
 */
export const getStatusBadgeClass = (status: BookingStatus): string => {
    switch (status) {
        case 'ACTIVE':
            return 'badge-success'
        case 'EXPIRED':
            return 'badge-error'
        default:
            return 'badge-neutral'
    }
}

/**
 * Get status label
 */
export const getStatusLabel = (status: BookingStatus): string => {
    switch (status) {
        case 'ACTIVE':
            return 'Active'
        case 'EXPIRED':
            return 'Expired'
        default:
            return 'Unknown'
    }
}
