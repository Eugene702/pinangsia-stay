import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { GET } from "./action"

const Header = dynamic(() => import('@/components/header'))
const Form = dynamic(() => import('./components/form'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Edit Kamar"
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const param = await params
    const response = await GET(param.id)
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main className="min-h-screen bg-gray-50">
        <Header
            title="Edit Kamar"
            breadcrumbs={[
                { text: "Manajemen Kamar", url: "/rooms" },
                { text: `Edit Kamar ${response.data!.room.no}` }
            ]} />

        <div className="mt-6">
            <div className="alert bg-amber-50 border-amber-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div className="text-amber-800">
                    <h3 className="font-bold">Perhatian</h3>
                    <div className="text-sm">Perubahan data kamar akan mempengaruhi informasi yang ditampilkan kepada tamu. Pastikan data yang dimasukkan sudah benar.</div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <div className="card bg-white shadow-lg border-0">
                <div className="card-header bg-gradient-to-r from-warning/10 to-warning/5 border-b border-gray-100">
                    <div className="card-body py-4">
                        <h2 className="card-title text-xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            Edit Kamar {response.data!.room.no}
                        </h2>
                        <p className="text-gray-600 mt-1">Perbarui informasi kamar yang diperlukan</p>
                    </div>
                </div>
                <div className="card-body">
                    <Form data={response.data!} />
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