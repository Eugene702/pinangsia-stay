"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const TabList = () => {
    const pathName = usePathname()
    const isTabActive = (path: string) => pathName === path

    return (
        <div className="flex bg-gray-50 rounded-xl p-1 mb-8">
            <Link 
                href="/auth/signin" 
                className={`flex-1 text-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isTabActive("/auth/signin")
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-white'
                }`}
            >
                Sign In
            </Link>
            <Link 
                href="/auth/signup" 
                className={`flex-1 text-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isTabActive("/auth/signup")
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-white'
                }`}
            >
                Sign Up
            </Link>
        </div>
    )
}

export default TabList