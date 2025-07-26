'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const settingsNavigation = [
    {
        name: 'Profile',
        href: '/settings/profile',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        description: 'Kelola informasi personal dan foto profil'
    },
    {
        name: 'Security',
        href: '/settings/security',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        description: 'Ubah password dan pengaturan keamanan'
    }
]

export default function SettingsNavigation() {
    const pathname = usePathname()

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Pengaturan
                </h2>
                
                <nav className="space-y-2">
                    {settingsNavigation.map((item) => {
                        const isActive = pathname === item.href
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    group flex items-start p-3 rounded-lg transition-all duration-200
                                    ${isActive 
                                        ? 'bg-primary/10 border border-primary/20 text-primary' 
                                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                                    }
                                `}
                            >
                                <div className={`
                                    flex-shrink-0 mr-3 mt-0.5
                                    ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}
                                `}>
                                    {item.icon}
                                </div>
                                
                                <div>
                                    <div className={`
                                        font-medium text-sm
                                        ${isActive ? 'text-primary' : 'text-gray-900'}
                                    `}>
                                        {item.name}
                                    </div>
                                    <div className={`
                                        text-xs mt-1
                                        ${isActive ? 'text-primary/70' : 'text-gray-500'}
                                    `}>
                                        {item.description}
                                    </div>
                                </div>
                                
                                {isActive && (
                                    <div className="ml-auto">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
