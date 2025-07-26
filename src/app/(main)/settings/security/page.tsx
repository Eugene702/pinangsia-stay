import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    title: "Security Settings - Pinangsia Stay"
}

const SettingsHeader = dynamic(() => import('../components/SettingsHeader'))
const SettingsNavigation = dynamic(() => import('../components/SettingsNavigation'))
const EditPassword = dynamic(() => import('../profile/components/editPassword'))

export default function SecurityPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <SettingsHeader 
                title="Security Settings" 
                description="Kelola password dan pengaturan keamanan akun Anda"
            />
            
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <SettingsNavigation />
                    </div>
                    
                    {/* Security Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Password & Security
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Ubah password Anda untuk menjaga keamanan akun
                                </p>
                            </div>
                            
                            <div className="p-6">
                                <EditPassword />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
