import dynamic from "next/dynamic"
import { ReactNode } from "react"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

const Sidenav = dynamic(() => import('./components/sidenav'))
const Navbar = dynamic(() => import('./components/navbar'))
const SessionProvider = dynamic(() => import('./components/sessionProvider'))

const Layout = async ({ children, modal }: { children: ReactNode, modal: ReactNode }) => {
    const session = await getServerSession(authOptions)
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