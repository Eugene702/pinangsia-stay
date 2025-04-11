import dynamic from "next/dynamic"
import { GET } from "./action"

const Ui = dynamic(() => import('./components/ui'), { ssr: !!false })
const Error = dynamic(() => import('@/components/error'))

const page = async ({ params }: { params: { id: string } }) => {
    const response = await GET(params.id)
    if (response.name != "SUCCESS") {
        return <Error message={response.message!} />
    }

    return <main>
        <Ui data={response.data!} />
    </main>
}

export default page