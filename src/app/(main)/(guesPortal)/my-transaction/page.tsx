import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
    title: "Transaksi Saya"
}

const Header = dynamic(() => import("@/components/header"))
const Table = dynamic(() => import("./components/table"))
const page = () => {
    return <main>
        <Header
            title="Transaksi Saya"
            breadcrumbs={[
                { text: "Daftar Transaksi Saya" }
            ]} />

        <div className="mt-5 bg-white shadow card">
            <div className="card-body">
                <Table />
            </div>
        </div>
    </main>
}

export default page