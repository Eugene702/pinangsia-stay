"use server"

import { prisma } from "@/utils/database"
import { Prisma } from "@prisma/client"
import { getCldImageUrl } from "next-cloudinary"

export type RoomCategoryPayload = Prisma.RoomCategoryGetPayload<{
    select: {
        id: true,
        photo: true,
        name: true,
        price: true,
        description: true,
        detail: {
            select: {
                facilities: true,
                amenities: true,
                roomSize: true,
                maxOccupancy: true,
                bedType: true,
                viewType: true
            }
        },
        _count: {
            select: {
                room: true,
                booking: {
                    where: {
                        paidOff: {
                            not: null
                        }
                    }
                }
            }
        }
    }
}>

export interface FormattedRoomCategory {
    id: string
    name: string
    description: string | null
    price: number
    capacity: number
    facilities: string[]
    amenities: string[]
    roomSize?: number | null
    bedType: string | null
    viewType: string | null
    image: string
    totalRooms: number
    availableRooms: number
}

export const getRoomCategories = async (): Promise<FormattedRoomCategory[]> => {
    try {
        const roomCategories = await prisma.roomCategory.findMany({
            select: {
                id: true,
                photo: true,
                name: true,
                price: true,
                description: true,
                detail: {
                    select: {
                        facilities: true,
                        amenities: true,
                        roomSize: true,
                        maxOccupancy: true,
                        bedType: true,
                        viewType: true
                    }
                },
                _count: {
                    select: {
                        room: true,
                        booking: {
                            where: {
                                paidOff: {
                                    not: null
                                }
                            }
                        }
                    }
                }
            },
            where: {
                deletedAt: null
            },
            orderBy: {
                price: 'asc'
            }
        })

        // Format data untuk landing page
        const formattedRooms: FormattedRoomCategory[] = roomCategories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
            price: Number(category.price),
            capacity: category.detail?.maxOccupancy || 2,
            facilities: category.detail?.facilities || [],
            amenities: category.detail?.amenities || [],
            roomSize: category.detail?.roomSize || null,
            bedType: category.detail?.bedType || null,
            viewType: category.detail?.viewType || null,
            image: category.photo 
                ? getCldImageUrl({ src: category.photo })
                : '/images/kamar1.png',
            totalRooms: category._count.room,
            availableRooms: Math.max(0, category._count.room - category._count.booking)
        }))

        return formattedRooms
    } catch (error) {
        console.error('Error fetching room categories:', error)
        throw new Error('Failed to fetch room categories')
    }
}

export interface ServiceItem {
    id: string
    title: string
    image: string
    price: string
    features: string[]
    description: string
    totalRooms: number
    availableRooms: number
}

export const getServices = async (): Promise<ServiceItem[]> => {
    try {
        const roomCategories = await getRoomCategories()
        
        // Convert room categories to services format
        const services: ServiceItem[] = roomCategories.map(room => ({
            id: room.id,
            title: room.name,
            image: room.image,
            price: `IDR ${room.price.toLocaleString('id-ID')}`,
            features: [
                ...room.facilities.slice(0, 3), // Take first 3 facilities
                ...room.amenities.slice(0, 2), // Take first 2 amenities
                `Max ${room.capacity} guests`
            ].filter(Boolean),
            description: room.description || `Comfortable ${room.name.toLowerCase()} with modern amenities and excellent service.`,
            totalRooms: room.totalRooms,
            availableRooms: room.availableRooms
        }))

        return services
    } catch (error) {
        console.error('Error fetching services:', error)
        throw new Error('Failed to fetch services')
    }
}
