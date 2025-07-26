import { ReactNode } from "react"
import dynamic from "next/dynamic"
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/authOptions"
import ClientNavbarWrapper from "./clientNavbarWrapper"

const SessionProvider = dynamic(() => import('./sessionProvider'))

const GuestLayout = async ({ children, modal }: { children: ReactNode, modal: ReactNode }) => {
    const session = await getServerSession(authOptions)
    
    return (
        <SessionProvider session={session!}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
                <ClientNavbarWrapper />
                {modal}
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    {children}
                </main>
                
                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 mt-16">
                    <div className="container mx-auto px-4 py-8 max-w-7xl">
                        <div className="text-center text-gray-600">
                            <p className="mb-2">© 2025 Pinangsia Stay. All rights reserved.</p>
                            <p className="text-sm">Experience luxury and comfort in the heart of Jakarta</p>
                        </div>
                    </div>
                </footer>
            </div>
        </SessionProvider>
    )
}

export default GuestLayout
