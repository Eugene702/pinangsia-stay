import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import { GET } from "./action"
import Image from "next/image"
import { getCldImageUrl } from "next-cloudinary"
import { converToRupiah } from "@/utils/utils"

export const metadata: Metadata = {
    title: "Reservasi Kamar"
}

const Header = dynamic(() => import('@/components/header'))
const Error = dynamic(() => import('@/components/error'))

const page = async () => {
    const response = await GET()
    if (response.name != "SUCCESS") {
        return <Error message={response.message!} />
    }

    return <main>
        <Header
            title="Reservasi Kamar"
            breadcrumbs={[
                { text: "Reservasi Kamar" }
            ]} />

        <div className="mt-5 grid grid-cols-4 gap-6">
            {
                response.data!.map((e, index) => <div className="card bg-base-100 w-full shadow-sm" key={index}>
                    <figure>
                        <Image
                            src={getCldImageUrl({ src: e.photo })}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-40 object-cover"
                            alt={`kamar ${e.name}`} />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            {e.name}
                            <div className="badge badge-primary">{converToRupiah(Number(e.price))}</div>
                        </h2>
                        <div className="card-actions justify-end">
                            <Link href={`/room-reservation/${e.id}`} className="btn btn-sm btn-outline">Buat Pesanan</Link>
                        </div>
                    </div>
                </div>)
            }
        </div>
    </main>
}

export default page