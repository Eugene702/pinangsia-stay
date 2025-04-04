import { Metadata } from "next"
import dynamic from "next/dynamic"

const Header = dynamic(() => import('@/components/header'))
const Form = dynamic(() => import('./components/form'))

export const metadata: Metadata = {
    title: "Edit Kategori Kamar"
}

const page = () => {
    return <main>
        <Header
            title="Edit Kategori Kamar"
            breadcrumbs={[
                { text: "Daftar Kategori Kamar", url: "/category" },
                { text: "Edit Kategori Kamar" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Form />
            </div>
        </div>
    </main>
}

export default page