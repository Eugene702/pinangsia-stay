import dynamic from "next/dynamic"
import { GET } from "./action"
import { converToRupiah } from "@/utils/utils"
import Header from "@/app/(main)/components/Header"
import DashboardContent from "./components/DashboardContent"

const Error = dynamic(() => import('@/components/error'))

const page = async () => {
    const response = await GET()
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main className="p-6 space-y-6">
        <Header 
            title="Dashboard" 
            breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Dashboard", href: "/dashboard" }
            ]}
        />

        <div className="bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl p-6 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Analitik & Statistik</h2>
                    <p className="text-gray-500">Overview data hotel dan transaksi</p>
                </div>
            </div>

            <DashboardContent initialData={response.data!} />
        </div>
    </main>
}

export default page