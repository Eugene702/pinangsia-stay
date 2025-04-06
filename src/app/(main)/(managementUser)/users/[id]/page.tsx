import Breadcrumbs from "@/components/breadcrumbs"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { GET } from "./action"

const Form = dynamic(() => import("./components/form"))
const Error = dynamic(() => import('@/components/error'))
export const metadata: Metadata = {
    title: "Edit Resipsionis"
}

const page = async ({ params }: { params: { id: string } }) => {
    const response = await GET(params.id)
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main>
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Edit Resipsionis</h1>
            <Breadcrumbs
                item={[
                    { text: "Daftar Pengguna", url: "/users" },
                    { text: "Edit Resipsionis" }
                ]} />
        </div>

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Form user={response.data!} />
            </div>
        </div>
    </main>
}

export default page