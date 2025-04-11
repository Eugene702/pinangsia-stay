import { Metadata } from "next"
import dynamic from "next/dynamic"
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

    return <main>
        <Header
            title="Edit Kamar"
            breadcrumbs={[
                { text: "Daftar Kamar", url: "/rooms" },
                { text: "Edit Kamar" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Form data={response.data!} />
            </div>
        </div>
    </main>
}

export default page