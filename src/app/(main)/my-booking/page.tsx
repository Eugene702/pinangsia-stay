import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
    title: "Pemesanan saya"
}

const Header = dynamic(() => import('@/components/header'))
const Table = dynamic(() => import('./components/table'))

const page = () => {
    return <main>
        <Header
            title="Pemesanan Saya"
            breadcrumbs={[
                { text: "Daftar Pemesanan Saya" }
            ]} />

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">

            </div>
        </div>

        <div className="mt-5 card bg-white shadow">
            <div className="card-body">
                <Table />
            </div>
        </div>
    </main>
}

export default page