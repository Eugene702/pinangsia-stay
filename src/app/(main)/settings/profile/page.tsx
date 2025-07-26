import { Metadata } from "next";
import { GET } from "./action";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    title: "Profile Settings - Pinangsia Stay"
}

const Error = dynamic(() => import('@/components/error'))
const SettingsHeader = dynamic(() => import('../components/SettingsHeader'))
const SettingsNavigation = dynamic(() => import('../components/SettingsNavigation'))
const ProfileContent = dynamic(() => import('./components/ProfileContentWrapper'))

const page = async () => {
    const response = await GET()
    
    if (response.name !== "SUCCESS") {
        return (
            <main className="min-h-screen bg-gray-50">
                <SettingsHeader 
                    title="Profile Settings" 
                    description="Kelola informasi personal, foto profil, dan preferensi akun Anda"
                />
                <div className="container mx-auto px-6 py-8">
                    <Error message={response.message!} />
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <SettingsHeader 
                title="Profile Settings" 
                description="Kelola informasi personal, foto profil, dan preferensi akun Anda"
            />
            
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <SettingsNavigation />
                    </div>
                    
                    {/* Profile Content */}
                    <div className="lg:col-span-3">
                        <ProfileContent userData={response.data!} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default page