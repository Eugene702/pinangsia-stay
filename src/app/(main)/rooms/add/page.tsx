import { Metadata } from "next"
import dynamic from "next/dynamic"

const Header = dynamic(() => import('@/components/header'))
const Form = dynamic(() => import('./components/form'))
export const metadata: Metadata = {
    title: "Tambah Kamar"
}

const page = () => {
    return <main>
        <Header
            title="Tambah Kamar"
            breadcrumbs={[
                { text: "Daftar Kamar", url: "/rooms" },
                { text: "Tambah Kamar" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Form />
            </div>
        </div>
    </main>
}

export default page