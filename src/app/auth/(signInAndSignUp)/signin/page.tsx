import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
    title: "Sign In - Pinangsia Stay",
    description: "Sign in to your Pinangsia Stay account"
}

const Form = dynamic(() => import("./components/form"))
const page = () => {
    return (
        <main>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your account to continue</p>
            </div>
            <Form />
        </main>
    )
}

export default page