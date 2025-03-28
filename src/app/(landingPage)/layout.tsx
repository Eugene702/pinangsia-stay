import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Navbar = dynamic(() => import("@/components/navbar"))
const Footer = dynamic(() => import("@/components/footer"))

const Layout = ({ children }: { children: ReactNode }) => {
    return <main>
        <Navbar />
        { children }
        <Footer />
    </main>
}

export default Layout