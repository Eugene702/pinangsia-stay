"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { activateAccount } from './action'

export default function ActivatePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    const activate = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Token aktivasi tidak ditemukan')
        return
      }

      try {
        const result = await activateAccount(token)
        
        if (result.name === 'SUCCESS') {
          setStatus('success')
          setMessage(result.message || 'Akun berhasil diaktifkan!')
          setTimeout(() => {
            router.push('/auth/signin')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(result.message || 'Terjadi kesalahan saat mengaktifkan akun')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Terjadi kesalahan pada server')
      }
    }

    activate()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mengaktifkan Akun</h1>
              <p className="text-gray-600">Mohon tunggu sebentar...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Aktivasi Berhasil! 🎉</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Anda akan diarahkan ke halaman login dalam 3 detik...</p>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Login Sekarang
                </button>
              </div>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Aktivasi Gagal ❌</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Daftar Ulang
                </button>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Kembali ke Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
