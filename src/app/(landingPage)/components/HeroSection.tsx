'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            image: '/images/hotel.webp',
            title: 'Welcome to Pinangsia Stay',
            subtitle: 'Experience Luxury in the Heart of Jakarta',
            description: 'Discover premium accommodations with exceptional service and modern amenities in Jakarta\'s most prestigious location.'
        },
        {
            image: '/images/kamar1.png',
            title: 'Premium Rooms & Suites',
            subtitle: 'Comfort Redefined',
            description: 'Elegantly designed rooms and suites featuring contemporary decor, luxury amenities, and stunning city views.'
        },
        {
            image: '/images/hotel-pinangsia-yakarta-20201031100437.jpg',
            title: 'Exceptional Service',
            subtitle: '24/7 Hospitality Excellence',
            description: 'Our dedicated team ensures every moment of your stay exceeds expectations with personalized attention and care.'
        }
    ]

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [slides.length])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Images */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            quality={90}
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-lg lg:text-xl font-medium mb-2 opacity-90">
                        {slides[currentSlide].subtitle}
                    </h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                        {slides[currentSlide].title}
                    </h1>
                    <p className="text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
                        {slides[currentSlide].description}
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/auth"
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg w-full sm:w-auto"
                    >
                        Book Your Stay
                    </Link>
                    <Link
                        href="/about"
                        className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 w-full sm:w-auto"
                    >
                        Learn More
                    </Link>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            {/* Navigation Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-110"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button
                onClick={nextSlide}
                className="absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-110"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? 'bg-white scale-125'
                                : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}

export default HeroSection
