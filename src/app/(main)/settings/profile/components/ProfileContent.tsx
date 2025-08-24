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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">NIK:</span>
                            <p className="font-medium font-mono">{userData.id}</p>
                        </div>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Profile Photo
                                </h3>
                                <EditPhoto />
                            </div>

                            {/* KTP Information */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                    Informasi KTP
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            NIK (Nomor Induk Kependudukan)
                                        </label>
                                        <div className="bg-white border border-gray-300 rounded-lg px-4 py-3">
                                            <span className="font-mono text-lg font-semibold text-gray-900">
                                                {userData.id}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {userData.ktpPhoto && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Foto KTP
                                            </label>
                                            <div className="bg-white border border-gray-300 rounded-lg p-4">
                                                {/* Debug info */}
                                                {process.env.NODE_ENV === 'development' && (
                                                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                                        <strong>Debug KTP URL:</strong> <br />
                                                        <span className="break-all">{userData.ktpPhoto}</span>
                                                    </div>
                                                )}
                                                <div className="relative group cursor-pointer" onClick={() => {
                                                    if (!userData.ktpPhoto) return;
                                                    const modal = document.createElement('div');
                                                    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                                                    const fullImageUrl = getCldImageUrl({
                                                        src: userData.ktpPhoto,
                                                        width: 1200,
                                                        height: 800
                                                    });
                                                    modal.innerHTML = `
                                                        <div class="relative max-w-4xl max-h-[90vh] m-4 flex items-center justify-center">
                                                            <img src="${fullImageUrl}" alt="KTP Full Size" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                                                            <button class="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center transition-colors">×</button>
                                                        </div>
                                                    `;
                                                    modal.onclick = (e) => {
                                                        if (e.target === modal || (e.target as HTMLElement).tagName === 'BUTTON') {
                                                            document.body.removeChild(modal);
                                                        }
                                                    };
                                                    document.body.appendChild(modal);
                                                }}>
                                                    {/* Use regular img tag instead of Next.js Image */}
                                                    <div className="w-full max-w-md mx-auto">
                                                        <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow duration-200">
                                                            <img
                                                                src={getCldImageUrl({
                                                                    src: userData.ktpPhoto!,
                                                                    crop: 'fill',
                                                                    width: 400,
                                                                    height: 250
                                                                })}
                                                                alt="Foto KTP"
                                                                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-200"
                                                                style={{
                                                                    minHeight: '150px',
                                                                    maxHeight: '250px'
                                                                }}
                                                            />
                                                            {/* Overlay with zoom icon */}
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                    <div className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
                                                                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Klik gambar untuk memperbesar
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {!userData.ktpPhoto && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <div>
                                                    <p className="text-amber-800 font-medium">Foto KTP belum diunggah</p>
                                                    <p className="text-amber-700 text-sm">Foto KTP diperlukan untuk verifikasi identitas</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
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
