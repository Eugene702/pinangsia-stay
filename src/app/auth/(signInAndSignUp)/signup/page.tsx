import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
    title: "Daftar Pengguna"
}

const Form = dynamic(() => import("./components/form"))
const page = () => {
    return <main>
        <h1 className="text-xl font-bold text-center">Daftar Pengguna</h1>
        <div className="py-4">
            <Form />
        </div>
    </main>
}

export default page