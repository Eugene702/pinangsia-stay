import dynamic from "next/dynamic"
import { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"

const Sidenav = dynamic(() => import('./components/sidenav'))
const Navbar = dynamic(() => import('./components/navbar'))
const SessionProvider = dynamic(() => import('./components/sessionProvider'))
const GuestLayout = dynamic(() => import('./components/guestLayout'))

const Layout = async ({ children, modal }: { children: ReactNode, modal: ReactNode }) => {
    const session = await getServerSession(authOptions)
    
    // Use guest layout for customers
    if (session?.user?.role === "CUSTOMER") {
        return <GuestLayout children={children} modal={modal} />
    }
    
    // Use admin/staff layout for other roles
    return <SessionProvider session={session!}>
        <main className="drawer lg:drawer-open">
            <input type="checkbox" id="drawer" className="drawer-toggle" />
            <div className="drawer-content">
                <Navbar />
                {modal}
                <div className="p-6">
                    {children}
                </div>
            </div>
            <Sidenav />
        </main>
    </SessionProvider>
}

export default Layout