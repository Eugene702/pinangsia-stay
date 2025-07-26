import { ReactNode } from "react"
import Image from "next/image"

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-red-600 to-red-800 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hotel.webp"
                        alt="Pinangsia Stay"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <div className="flex items-center mb-6">
                            <Image
                                src="/images/logo.png"
                                alt="Pinangsia Stay"
                                width={60}
                                height={60}
                                className="rounded-lg shadow-lg"
                            />
                            <div className="ml-4">
                                <h1 className="text-3xl font-bold tracking-tight">Pinangsia Stay</h1>
                                <p className="text-red-100">Premium Hotel Experience</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold leading-tight">
                            Welcome to<br />
                            Your Perfect Stay
                        </h2>
                        <p className="text-xl text-red-100 leading-relaxed">
                            Experience luxury and comfort in the heart of Jakarta. 
                            Book your perfect accommodation with us today.
                        </p>
                        
                        <div className="flex items-center space-x-8 pt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold">500+</div>
                                <div className="text-red-200 text-sm">Happy Guests</div>
                            </div>
                            <div className="w-px h-12 bg-red-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">4.9</div>
                                <div className="text-red-200 text-sm">Rating</div>
                            </div>
                            <div className="w-px h-12 bg-red-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-red-200 text-sm">Service</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            </div>
            
            {/* Right Side - Auth Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Mobile Logo Header */}
                        <div className="lg:hidden bg-gradient-to-r from-red-600 to-red-700 p-6 text-center">
                            <div className="flex items-center justify-center mb-3">
                                <Image
                                    src="/images/logo.png"
                                    alt="Pinangsia Stay"
                                    width={40}
                                    height={40}
                                    className="rounded-lg"
                                />
                                <h1 className="ml-3 text-xl font-bold text-white">Pinangsia Stay</h1>
                            </div>
                            <p className="text-red-100 text-sm">Premium Hotel Experience</p>
                        </div>
                        
                        <div className="p-8">
                            {children}
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            © 2025 Pinangsia Stay. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Layout