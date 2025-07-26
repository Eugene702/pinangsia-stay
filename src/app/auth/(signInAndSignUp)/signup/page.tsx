import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
    title: "Sign Up - Pinangsia Stay",
    description: "Create your Pinangsia Stay account"
}

const Form = dynamic(() => import("./components/form"))
const page = () => {
    return (
        <main>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Join us and start your perfect stay experience</p>
            </div>
            <div className="py-2">
                <Form />
            </div>
        </main>
    )
}

export default page