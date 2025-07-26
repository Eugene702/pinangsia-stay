'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRooms } from '../hooks/useRooms'

const FeaturesSection = () => {
    const { rooms: roomCategories, isLoading, error, refetch } = useRooms()

    const features = [
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            title: 'Premium Location',
            description: 'Located in the heart of Jakarta with easy access to business districts and tourist attractions.'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: '24/7 Service',
            description: 'Round-the-clock customer service to ensure your comfort and satisfaction throughout your stay.'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Safe & Secure',
            description: 'Advanced security systems and protocols to ensure your safety and peace of mind.'
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            title: 'Best Value',
            description: 'Competitive pricing with exceptional value for premium accommodations and services.'
        }
    ]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

    return (
        <section className="py-16 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Why Choose Us */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose Pinangsia Stay?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Experience the perfect combination of luxury, comfort, and convenience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group hover:-translate-y-2"
                        >
                            <div className="text-red-600 mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Room Categories */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            Our Premium Rooms
                        </h2>
                        {!isLoading && !error && (
                            <button
                                onClick={() => refetch()}
                                className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Refresh room availability"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover our carefully designed accommodations for every type of traveler
                    </p>
                    {!isLoading && !error && roomCategories.length > 0 && (
                        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span>{roomCategories.reduce((sum, room) => sum + room.availableRooms, 0)} Available</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                                <span>{roomCategories.length} Room Types</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                <span>Updated in real-time</span>
                            </div>
                        </div>
                    )}
                </div>

                {isLoading ? (
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
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-600 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => refetch()}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {roomCategories.map((room) => (
                            <div
                                key={room.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={room.image}
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
                )}

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <Link
                        href="/services"
                        className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg"
                    >
                        View All Rooms
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
