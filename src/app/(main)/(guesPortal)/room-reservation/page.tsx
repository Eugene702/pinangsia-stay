import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { GET } from "./action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { converToRupiah } from "@/utils/utils"
import RoomImage from "../../components/roomImage"

export const metadata: Metadata = {
    title: "Room Reservation - Pinangsia Stay",
    description: "Book your perfect room at Pinangsia Stay"
}

const Error = dynamic(() => import('@/components/error'))

const page = async () => {
    const response = await GET()
    if (response.name != "SUCCESS") {
        return <Error message={response.message!} />
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-white shadow-lg">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Choose Your Perfect Room
                </h1>
                <p className="text-xl text-red-100 max-w-2xl mx-auto">
                    Experience luxury and comfort with our premium accommodations
                </p>
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Free WiFi</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>24/7 Service</span>
                    </div>
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>Prime Location</span>
                    </div>
                </div>
            </div>

            {/* Rooms Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Available Rooms</h2>
                        <p className="text-gray-600 mt-1">Choose from our premium room categories</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        {response.data!.length} room {response.data!.length === 1 ? 'category' : 'categories'} available
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {response.data!.map((room, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 border border-gray-100"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <RoomImage
                                    src={getCldImageUrl({ src: room.photo })}
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    alt={`${room.name} room`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                <div className="absolute top-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-red-600 font-bold text-sm">
                                            {converToRupiah(Number(room.price))}
                                        </span>
                                    </div>
                                </div>
                                {room.detail?.maxOccupancy && (
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-white text-xs">{room.detail.maxOccupancy}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {room.name}
                                        </h3>
                                        {room.detail?.roomSize && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                {room.detail.roomSize}m²
                                            </span>
                                        )}
                                    </div>
                                    
                                    {room.detail?.bedType && (
                                        <p className="text-gray-600 text-sm mb-2">
                                            {room.detail.bedType} • {room.detail.viewType || 'Standard View'}
                                        </p>
                                    )}
                                    
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                        {room.description || `Experience comfort and luxury in our ${room.name.toLowerCase()}`}
                                    </p>
                                    
                                    {/* Facilities Preview */}
                                    {room.detail?.facilities && room.detail.facilities.length > 0 && (
                                        <div className="mb-3">
                                            <div className="flex flex-wrap gap-1">
                                                {room.detail.facilities.slice(0, 3).map((facility, idx) => (
                                                    <span key={idx} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full border border-red-100">
                                                        {facility}
                                                    </span>
                                                ))}
                                                {room.detail.facilities.length > 3 && (
                                                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-200">
                                                        +{room.detail.facilities.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        <span className="font-medium">per night</span>
                                    </div>
                                    <Link
                                        href={`/room-reservation/${room.id}`}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                    >
                                        <span>Book Now</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Pinangsia Stay?</h3>
                    <p className="text-gray-600">Experience exceptional hospitality and world-class amenities</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Prime Location</h4>
                        <p className="text-gray-600 text-sm">Located in the heart of Jakarta with easy access to major attractions</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">24/7 Service</h4>
                        <p className="text-gray-600 text-sm">Round-the-clock assistance to ensure your comfort throughout your stay</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
                        <p className="text-gray-600 text-sm">High-quality amenities and services for an unforgettable experience</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page