import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"

const Header = dynamic(() => import("@/components/header"))
const Form = dynamic(() => import("./components/form"))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Edit Pengguna Sistem"
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const response = await GET((await params).id)
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main className="min-h-screen bg-gray-50">
        <Header
            title="Edit Pengguna Sistem"
            breadcrumbs={[
                { text: "Manajemen Pengguna", url: "/users" },
                { text: "Edit Pengguna" }
            ]} />

        <div className="mt-6">
            <div className="alert alert-warning shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                    <h3 className="font-bold">Edit Data Pengguna</h3>
                    <div className="text-xs">Anda sedang mengedit data pengguna <strong>{response.data!.name}</strong>. Pastikan perubahan yang dilakukan sudah sesuai dan benar.</div>
                </div>
            </div>
        </div>

        <div className="mt-6">
            <div className="card bg-white shadow-lg border-0">
                <div className="card-body">
                    <Form user={response.data!} />
                </div>
            </div>
        </div>
    </main>
}

export default page