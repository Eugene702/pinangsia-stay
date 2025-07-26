'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LandingNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/contact', label: 'Contact' }
    ]

    const isActiveLink = (href: string) => {
        if (href === '/') {
            return pathname === '/'
        }
        return pathname?.startsWith(href)
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-lg' 
                : 'bg-transparent'
        }`}>
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <Image
                            src="/images/logo.png"
                            alt="Pinangsia Stay"
                            width={40}
                            height={40}
                            className="w-8 h-8 lg:w-10 lg:h-10"
                        />
                        <span className={`text-xl lg:text-2xl font-bold transition-colors ${
                            isScrolled ? 'text-gray-900' : 'text-white'
                        }`}>
                            Pinangsia Stay
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`font-medium transition-colors hover:text-primary ${
                                    isActiveLink(link.href)
                                        ? 'text-primary'
                                        : isScrolled 
                                            ? 'text-gray-700 hover:text-primary' 
                                            : 'text-white hover:text-primary'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/auth"
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
                        >
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            isScrolled ? 'text-gray-900' : 'text-white'
                        }`}
                        aria-label="Toggle mobile menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
                        <div className="py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block px-4 py-3 font-medium transition-colors ${
                                        isActiveLink(link.href)
                                            ? 'text-primary bg-primary/5 border-r-4 border-primary'
                                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="px-4 pt-2">
                                <Link
                                    href="/auth"
                                    className="block w-full bg-primary hover:bg-primary/90 text-white text-center px-6 py-3 rounded-lg font-medium transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default LandingNavbar
