'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Testimonial {
    id: string
    name: string
    role: string
    company?: string
    photo: string
    content: string
    rating: number
    date: string
}

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    // Mock data for testimonials
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 800))
                
                const mockData: Testimonial[] = [
                    {
                        id: '1',
                        name: 'Amanda Sarah',
                        role: 'Business Executive',
                        company: 'PT Jakarta Prima',
                        photo: '/images/mando.jpg',
                        content: 'Exceptional service and beautiful rooms! The staff was incredibly helpful and the location is perfect for business meetings.',
                        rating: 5,
                        date: '2024-12-15'
                    },
                    {
                        id: '2',
                        name: 'Michael Chen',
                        role: 'Tour Guide',
                        company: 'Jakarta Tours',
                        photo: '/images/hotel.webp',
                        content: 'As someone who regularly brings guests to various hotels, Pinangsia Stay consistently delivers quality and comfort.',
                        rating: 5,
                        date: '2024-12-10'
                    },
                    {
                        id: '3',
                        name: 'Sarah Williams',
                        role: 'Travel Blogger',
                        company: 'Wanderlust Stories',
                        photo: '/images/kutip.png',
                        content: 'The perfect blend of modern amenities and warm hospitality. The room was spotless and the breakfast was outstanding!',
                        rating: 5,
                        date: '2024-12-08'
                    }
                ]
                
                setTestimonials(mockData)
            } catch (error) {
                console.error('Failed to load testimonials:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTestimonials()
    }, [])

    // Auto-advance testimonials
    useEffect(() => {
        if (testimonials.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [testimonials.length])

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))
    }

    if (isLoading) {
        return (
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center mb-16">
                        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (testimonials.length === 0) {
        return null
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        What Our Guests Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Read authentic reviews from our satisfied guests
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 relative">
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-6 text-gray-200">
                            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                            </svg>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-6">
                            <div className="flex items-center">
                                {renderStars(currentTestimonial.rating)}
                            </div>
                            <span className="ml-2 text-gray-600 font-medium">
                                {currentTestimonial.rating}.0
                            </span>
                        </div>

                        {/* Content */}
                        <blockquote className="text-xl lg:text-2xl text-gray-800 leading-relaxed mb-8 font-medium">
                            "{currentTestimonial.content}"
                        </blockquote>

                        {/* Author Info */}
                        <div className="flex items-center">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                                <Image
                                    src={currentTestimonial.photo}
                                    alt={currentTestimonial.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {currentTestimonial.name}
                                </h4>
                                <p className="text-gray-600">
                                    {currentTestimonial.role}
                                    {currentTestimonial.company && ` • ${currentTestimonial.company}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center mt-8 space-x-3">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'bg-primary scale-125'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">500+</div>
                            <div className="text-gray-600">Happy Guests</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">4.9</div>
                            <div className="text-gray-600">Average Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">98%</div>
                            <div className="text-gray-600">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
