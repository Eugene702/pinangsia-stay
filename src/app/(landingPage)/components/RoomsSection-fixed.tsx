'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getRoomCategories } from '../action'

// Server Component untuk rooms
const RoomsServerComponent = async () => {
    try {
        const roomCategories = await getRoomCategories()

        const formatPrice = (price: number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(price)
        }

        const getValidImageSrc = (imageSrc: string) => {
            // Cek jika sudah absolute URL
            if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
                return imageSrc
            }
            // Cek jika sudah dimulai dengan /
            if (imageSrc.startsWith('/')) {
                return imageSrc
            }
            // Tambahkan / di depan jika belum ada
            return `/${imageSrc}`
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {roomCategories.map((room) => (
                    <div
                        key={room.id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <Image
                                src={getValidImageSrc(room.image)}
                                alt={room.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = '/images/kamar1.png'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    room.availableRooms > 0 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {room.availableRooms > 0 ? `${room.availableRooms} Available` : 'Fully Booked'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {room.name}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Max {room.capacity}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                                {room.description}
                            </p>
                            
                            {/* Facilities Preview */}
                            {room.facilities.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {room.facilities.slice(0, 3).map((facility, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                {facility}
                                            </span>
                                        ))}
                                        {room.facilities.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                +{room.facilities.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-red-600">
                                    {formatPrice(room.price)}
                                    <span className="text-sm font-normal text-gray-500">/night</span>
                                </div>
                                <Link
                                    href="/auth"
                                    className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                                        room.availableRooms > 0
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {room.availableRooms > 0 ? 'Book Now' : 'Fully Booked'}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    } catch (error) {
        console.error('Error loading rooms:', error)
        return (
            <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-gray-600">Failed to load rooms. Please try again later.</p>
            </div>
        )
    }
}

// Loading skeleton
const RoomsLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                </div>
            </div>
        ))}
    </div>
)

// Main component export
export const RoomsSection = () => (
    <Suspense fallback={<RoomsLoadingSkeleton />}>
        <RoomsServerComponent />
    </Suspense>
)
