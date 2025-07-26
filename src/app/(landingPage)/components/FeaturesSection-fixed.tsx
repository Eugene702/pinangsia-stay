'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface RoomCategory {
    id: string
    name: string
    photo: string
    price: number
    description: string
}

const FeaturesSection = () => {
    const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Real data simulation - in production this would fetch from database
    useEffect(() => {
        const fetchRoomCategories = async () => {
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                const mockData: RoomCategory[] = [
                    {
                        id: '1',
                        name: 'Superior Room',
                        photo: '/images/kamar1.png',
                        price: 850000,
                        description: 'Spacious room with modern amenities and city view. Perfect for business travelers.'
                    },
                    {
                        id: '2',
                        name: 'Deluxe Suite',
                        photo: '/images/kamar2.jpg',
                        price: 1200000,
                        description: 'Luxurious suite with separate living area and premium facilities. Ideal for extended stays.'
                    },
                    {
                        id: '3',
                        name: 'Executive Room',
                        photo: '/images/kamar3.jpg',
                        price: 950000,
                        description: 'Business-friendly room with work desk and high-speed internet. Great for professionals.'
                    }
                ]
                
                setRoomCategories(mockData)
            } catch (error) {
                console.error('Failed to load room categories:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchRoomCategories()
    }, [])

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
                            <div className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
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
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Our Premium Rooms
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover our carefully designed accommodations for every type of traveler
                    </p>
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
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {roomCategories.map((room) => (
                            <div
                                key={room.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={room.photo}
                                        alt={room.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {room.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {room.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-primary">
                                            {formatPrice(room.price)}
                                            <span className="text-sm font-normal text-gray-500">/night</span>
                                        </div>
                                        <Link
                                            href="/auth"
                                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                                        >
                                            Book Now
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
                        className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg"
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
