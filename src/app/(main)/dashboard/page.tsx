import dynamic from "next/dynamic"

const ForAdmin = dynamic(() => import('./components/ForAdmin'))
const page = () => {
    return <main>
        <ForAdmin />
    </main>
}

export default page