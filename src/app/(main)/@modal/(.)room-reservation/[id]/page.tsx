import dynamic from "next/dynamic"

const Modal = dynamic(() => import('./components/modal'))
const Ui = dynamic(() => import('@/app/(main)/(guesPortal)/room-reservation/[id]/components/ui'))
const page = () => {
    return <main>
        <Modal>
            <Ui />
        </Modal>
    </main>
}

export default page