import dynamic from "next/dynamic"
import { ReactNode } from "react"

const Sidenav = dynamic(() => import('./components/sidenav'))
const Navbar = dynamic(() => import('./components/navbar'))

const Layout = ({ children }: { children: ReactNode }) => {
    return <main className="drawer lg:drawer-open">
        <input type="checkbox" id="drawer" className="drawer-toggle" />
        <div className="drawer-content">
            <Navbar />
            <div className="p-6">
                {children}
            </div>
        </div>
        <Sidenav />
    </main>
}

export default Layout