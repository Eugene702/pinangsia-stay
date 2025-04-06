"use client"

import { useRouter } from "next/navigation"

type ErrorProps = {
    message: string,
    redirectUrl?: string
}

const Error = ({ message, redirectUrl }: ErrorProps) => {
    const router = useRouter()
    const handleOnClick = () => {
        if(redirectUrl){
            router.replace(redirectUrl)
        }else{
            router.back()
        }
    }

    return <main className="w-full h-screen flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-bold">{ message }</h1>
        <button className="btn btn-outline" onClick={handleOnClick}>Kembali dan coba kembali!</button>
    </main>
}

export default Error