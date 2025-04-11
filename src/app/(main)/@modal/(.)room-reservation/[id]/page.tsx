import { GET } from "@/app/(main)/(guesPortal)/room-reservation/[id]/action"
import dynamic from "next/dynamic"

const Modal = dynamic(() => import('./components/modal'))
const Ui = dynamic(() => import('@/app/(main)/(guesPortal)/room-reservation/[id]/components/ui'))
const Error = dynamic(() => import('@/components/error'))

const page = async ({ params }: { params: { id: string } }) => {
    const response = await GET(params.id)
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main>
        <Modal>
            <Ui data={response.data!} />
        </Modal>
    </main>
}

export default page