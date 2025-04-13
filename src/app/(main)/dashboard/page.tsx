import dynamic from "next/dynamic"
import { GET } from "./action"

const Error = dynamic(() => import('@/components/error'))
const page = async () => {
    const response = await GET()
    if(response.name != "SUCCESS"){
        return <Error message={response.message!} />
    }

    return <main>
        <div className="stats w-full border border-gray-200">
            <div className="stat">
                <div className="stat-title">Jumlah Kamar</div>
                <div className="stat-value">{ response.data!.room }</div>
                <div className="stat-desc">Jumlah semua kamar yang dimiliki</div>
            </div>
            <div className="stat">
                <div className="stat-title">Jumlah Kategori kamar</div>
                <div className="stat-value">{ response.data!.roomCategory }</div>
                <div className="stat-desc">Jumlah semua kategori kamar yang dimiliki</div>
            </div>
            <div className="stat">
                <div className="stat-title">Jumlah Resipsionis</div>
                <div className="stat-value">{ response.data!.user }</div>
                <div className="stat-desc">Jumlah semua karyawan resipsionis yang dimiliki</div>
            </div>
        </div>
    </main>
}

export default page