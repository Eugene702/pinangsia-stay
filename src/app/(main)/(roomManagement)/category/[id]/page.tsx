import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"

const Header = dynamic(() => import('@/components/header'))
const Form = dynamic(() => import('./components/form'))
const Error = dynamic(() => import('@/components/error'))

export const metadata: Metadata = {
    title: "Edit Kategori Kamar"
}

const page = async ({ params }: { params: { id: string } }) => {
    const response = await GET(params.id)
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main>
        <Header
            title="Edit Kategori Kamar"
            breadcrumbs={[
                { text: "Daftar Kategori Kamar", url: "/category" },
                { text: "Edit Kategori Kamar" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Form roomCategory={response.data!} />
            </div>
        </div>
    </main>
}

export default page