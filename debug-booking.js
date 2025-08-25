const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('=== CHECKING BOOKING DATA ===')
  
  // Get all bookings with dates
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      checkInDate: true,
      checkOutDate: true,
      bookingTime: true,
      paidOff: true,
      createdAt: true,
      user: {
        select: {
          name: true
        }
      },
      roomCategory: {
        select: {
          name: true,
          price: true
        }
      },
      roomAllocation: {
        select: {
          id: true,
          checkIn: true,
          checkOut: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })
  
  console.log('Recent bookings:')
  bookings.forEach((booking, index) => {
    console.log(`\n${index + 1}. Booking ID: ${booking.id}`)
    console.log(`   User: ${booking.user.name}`)
    console.log(`   Room: ${booking.roomCategory.name} (${booking.roomCategory.price})`)
    console.log(`   CheckInDate: ${booking.checkInDate}`)
    console.log(`   CheckOutDate: ${booking.checkOutDate}`)
    console.log(`   BookingTime (legacy): ${booking.bookingTime}`)
    console.log(`   PaidOff: ${booking.paidOff}`)
    console.log(`   RoomAllocation: ${booking.roomAllocation ? 'Yes' : 'No'}`)
    if (booking.roomAllocation) {
      console.log(`   Actual CheckIn: ${booking.roomAllocation.checkIn}`)
      console.log(`   Actual CheckOut: ${booking.roomAllocation.checkOut}`)
    }
    
    // Calculate nights
    if (booking.checkInDate && booking.checkOutDate) {
      const checkIn = new Date(booking.checkInDate)
      const checkOut = new Date(booking.checkOutDate)
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      const totalPrice = Number(booking.roomCategory.price) * nights
      console.log(`   Calculated Nights: ${nights}`)
      console.log(`   Calculated Total: ${totalPrice}`)
    }
  })
}

main()
  .catch(e => {
    console.error('Error:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
