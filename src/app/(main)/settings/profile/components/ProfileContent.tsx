'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getCldImageUrl } from 'next-cloudinary'
import dynamic from 'next/dynamic'
import { GetResponseType } from '../action'

const EditPhoto = dynamic(() => import('./editPhoto'))
const EditBiodata = dynamic(() => import('./editBiodata'))
const EditPassword = dynamic(() => import('./editPassword'))

interface ProfileContentProps {
    userData: GetResponseType
}

export default function ProfileContent({ userData }: ProfileContentProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')

    const tabs = [
        {
            id: 'profile' as const,
            name: 'Profile Information',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            id: 'security' as const,
            name: 'Security',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        }
    ]

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'MANAGER': return 'Manager'
            case 'RECIPIENT': return 'Resepsionis'
            case 'CUSTOMER': return 'Customer'
            default: return role
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'MANAGER': return 'badge-error'
            case 'RECIPIENT': return 'badge-warning'
            case 'CUSTOMER': return 'badge-info'
            default: return 'badge-neutral'
        }
    }

    return (
        <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                                <Image
                                    src={userData.photo ? getCldImageUrl({ src: userData.photo }) : "/images/logo.png"}
                                    alt="Profile"
                                    width={80}
                                    height={80}
                                    className="w-full h-full rounded-full object-cover"
                                    priority
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        
                        <div className="text-white">
                            <h2 className="text-2xl font-bold">{userData.name}</h2>
                            <p className="text-blue-100 mt-1">{userData.email}</p>
                            <div className="mt-2">
                                <span className={`badge ${getRoleBadgeColor(userData.role)} badge-sm`}>
                                    {getRoleDisplayName(userData.role)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Phone:</span>
                            <p className="font-medium">{userData.telp || 'Not provided'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Address:</span>
                            <p className="font-medium">{userData.address || 'Not provided'}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Member since:</span>
                            <p className="font-medium">
                                {new Date(userData.createdAt).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                    ${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
                                `}
                            >
                                <span className={`mr-2 ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                    {tab.icon}
                                </span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            {/* Photo Section */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Profile Photo
                                </h3>
                                <EditPhoto />
                            </div>

                            {/* Personal Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Personal Information
                                </h3>
                                <EditBiodata response={userData} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Change Password
                                </h3>
                                <EditPassword />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
