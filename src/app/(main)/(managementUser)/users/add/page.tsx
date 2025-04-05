import Breadcrumbs from "@/components/breadcrumbs"
import { Metadata } from "next"
import dynamic from "next/dynamic"

const Form = dynamic(() => import("./components/form"))
export const metadata: Metadata = {
    title: "Tambah Resipsionis"
}

const page = () => {
    return <main>
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Tambah Resipsionis</h1>
            <Breadcrumbs
                item={[
                    { text: "Daftar Pengguna", url: "/users" },
                    { text: "Tambah Resipsionis" }
                ]} />
        </div>

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Form />
            </div>
        </div>
    </main>
}

export default page