import dynamic from "next/dynamic"

const Stat = dynamic(() => import('./admin/Stat'))
const ForAdmin = () => {
    return <section>
        <Stat />
    </section>
}

export default ForAdmin