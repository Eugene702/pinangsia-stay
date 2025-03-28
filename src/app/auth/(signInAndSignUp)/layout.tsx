import dynamic from "next/dynamic"
import { ReactNode } from "react"

const TabList = dynamic(() => import("./components/tabList"))
const Layout = ({ children }: { children: ReactNode }) => {
    return <section>
        <TabList />

        <div className="py-4">
            {children}
        </div>
    </section>
}

export default Layout