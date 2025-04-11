import { Metadata } from "next"
import dynamic from "next/dynamic"
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

    return <main>
        <Header
            title="Tambah Kamar"
            breadcrumbs={[
                { text: "Daftar Kamar", url: "/rooms" },
                { text: "Tambah Kamar" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Form roomCategory={response.data!} />
            </div>
        </div>
    </main>
}

export default page