import dynamic from "next/dynamic"
import { GET } from "./action"
import { converToRupiah } from "@/utils/utils"
import Header from "@/app/(main)/components/Header"
import DashboardContent from "./components/DashboardContent"
import ReceptionistDashboard from "./components/ReceptionistDashboard"
import { getServerSession } from "next-auth"

const Error = dynamic(() => import('@/components/error'))

const page = async () => {
    const session = await getServerSession()
    const response = await GET()
    console.log(session);
    
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    // Use userRole from response data instead of session
    const userRole = response.data?.userRole

    // Show receptionist dashboard for RECIPIENT role
    if (userRole === "RECIPIENT") {
        return <main className="p-6 space-y-6">
            <Header 
                title="Dashboard Resepsionis" 
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Dashboard", href: "/dashboard" }
                ]}
            />

            <div className="bg-gradient-to-br from-blue-50 via-transparent to-purple-50 rounded-2xl p-6 backdrop-blur-sm border border-white/20 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Dashboard Resepsionis</h2>
                        <p className="text-gray-500">Kelola tamu dan pemesanan hotel</p>
                    </div>
                </div>

                <ReceptionistDashboard data={response.data!.receptionistData!} />
            </div>
        </main>
    }

    // Show full dashboard for MANAGER role
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

            <DashboardContent initialData={response.data! as any} />
        </div>
    </main>
}

export default page