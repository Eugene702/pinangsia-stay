import { ReactNode } from "react"

const Layout = ({ children }: { children: ReactNode }) => {
    return <main className="bg-gray-200 w-full h-screen flex justify-center items-center">
        <div className="card bg-white w-2/12">
            <div className="card-body">
                {children}
            </div>
        </div>
    </main>
}

export default Layout