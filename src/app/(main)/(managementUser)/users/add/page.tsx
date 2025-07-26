import { Metadata } from "next"
import dynamic from "next/dynamic"

const Header = dynamic(() => import("@/components/header"))
const Form = dynamic(() => import("./components/form"))

export const metadata: Metadata = {
    title: "Tambah Pengguna Sistem"
}

const page = () => {
    return <main className="min-h-screen bg-gray-50">
        <Header
            title="Tambah Pengguna Sistem"
            breadcrumbs={[
                { text: "Manajemen Pengguna", url: "/users" },
                { text: "Tambah Pengguna" }
            ]} />

        <div className="mt-6">
            <div className="alert alert-info shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 className="font-bold">Tambah Pengguna Baru</h3>
                    <div className="text-xs">Silakan lengkapi form di bawah untuk menambahkan pengguna baru ke sistem. Pastikan semua informasi yang dimasukkan sudah benar.</div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <div className="card bg-white shadow-lg border-0">
                <div className="card-body">
                    <Form />
                </div>
            </div>
        </div>
    </main>
}

export default page