import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { GET } from "./action"

const Header = dynamic(() => import('@/components/header'))
const Form = dynamic(() => import('./components/form'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Tambah Kamar"
}

const page = async () => {
    const response = await GET()
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main className="min-h-screen bg-gray-50">
        <Header
            title="Tambah Kamar Baru"
            breadcrumbs={[
                { text: "Manajemen Kamar", url: "/rooms" },
                { text: "Tambah Kamar" }
            ]} />

        <div className="mt-6">
            <div className="alert bg-blue-50 border-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div className="text-blue-800">
                    <h3 className="font-bold">Informasi</h3>
                    <div className="text-sm">Pastikan nomor kamar yang dimasukkan belum digunakan. Pilih kategori kamar sesuai dengan standar hotel.</div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <div className="card bg-white shadow-lg border-0">
                <div className="card-header bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-100">
                    <div className="card-body py-4">
                        <h2 className="card-title text-xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            Formulir Kamar Baru
                        </h2>
                        <p className="text-gray-600 mt-1">Lengkapi informasi kamar yang akan ditambahkan</p>
                    </div>
                </div>
                <div className="card-body">
                    <Form roomCategory={response.data!} />
                </div>
            </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
            <Link href="/rooms" className="btn btn-ghost gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Daftar
            </Link>
            
            <div className="text-sm text-gray-500">
                <span className="badge badge-outline">Required fields are marked with *</span>
            </div>
        </div>
    </main>
}

export default page