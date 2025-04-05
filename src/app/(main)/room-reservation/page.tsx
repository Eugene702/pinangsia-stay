import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Reservasi Kamar"
}

const Header = dynamic(() => import('@/components/header'))
const page = () => {
    return <main>
        <Header
            title="Reservasi Kamar"
            breadcrumbs={[
                { text: "Reservasi Kamar" }
            ]} />

        <div className="mt-5 grid grid-cols-4 gap-6">
            {
                Array.from({ length: 10 }).map((_, index) => <div className="card bg-base-100 w-full shadow-sm" key={index}>
                    <figure>
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                            alt="Shoes" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            Card Title
                            <div className="badge badge-secondary">NEW</div>
                        </h2>
                        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                        <div className="card-actions justify-end">
                            <Link href="/room-reservation/asas" className="btn btn-sm btn-outline">Buat Pesanan</Link>
                        </div>
                    </div>
                </div>)
            }
        </div>
    </main>
}

export default page