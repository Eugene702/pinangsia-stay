"use client"

import dynamic from "next/dynamic"

const GuestNavbar = dynamic(() => import('./guestNavbar'), {
    loading: () => (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>
        </nav>
    ),
    ssr: false
})

const ClientNavbarWrapper = () => {
    return <GuestNavbar />
}

export default ClientNavbarWrapper
