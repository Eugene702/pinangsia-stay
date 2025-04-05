import dynamic from "next/dynamic"

const Ui = dynamic(() => import('./components/ui'))
const page = () => {
    return <main>
        <Ui />
    </main>
}

export default page