"use client"

import { Metadata } from "next"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const Form = dynamic(() => import("./components/form"))

const page = () => {
    const searchParams = useSearchParams()
    const [showMessage, setShowMessage] = useState(false)
    const message = searchParams.get('message')

    useEffect(() => {
        if (message === 'activation-email-sent') {
            setShowMessage(true)
        }
    }, [message])

    return (
        <main>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            {showMessage && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-800">Email aktivasi telah dikirim!</p>
                            <p className="text-xs text-blue-600 mt-1">
                                Silakan cek email Anda dan klik link aktivasi untuk mengaktifkan akun.
                            </p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <a 
                            href="/auth/resend-activation"
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                            Tidak menerima email? Kirim ulang email aktivasi
                        </a>
                    </div>
                </div>
            )}

            <Form />
        </main>
    )
}

export default page