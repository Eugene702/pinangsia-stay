import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
    title: "Masuk Pengguna"
}

const Form = dynamic(() => import("./components/form"))
const page = () => {
    return <main>
        <h1 className="text-xl font-bold text-center">Masuk Pengguna</h1>
        <Form />
    </main>
}

export default page