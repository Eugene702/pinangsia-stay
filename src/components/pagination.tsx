"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

type Props = {
    hasNext: boolean,
    hasPrev: boolean
}
const Pagination = ({ hasNext, hasPrev }: Props) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const handlePageChange = (btn: "prev" | "next") => {
        const queryParams = new URLSearchParams(searchParams)
        if(btn === "prev"){
            if(queryParams.has("page") && parseInt(queryParams.get("page")!) > 1){
                queryParams.set("page", (parseInt(queryParams.get("page")!) - 1).toString())
            }else{
                queryParams.delete("page")
            }
        }else{
            if(queryParams.has("page")){
                queryParams.set("page", (parseInt(queryParams.get("page")!) + 1).toString())
            }else{
                queryParams.set("page", "2")
            }
        }

        const newUrl = `${pathname}?${queryParams.toString()}`
        router.replace(newUrl)
    }

    return <div className="join mt-5">
        <button className="join-item btn" name="prev" disabled={!hasPrev} onClick={() => handlePageChange("prev")}>
            <FaChevronLeft />
        </button>
        <button className="join-item btn">Halaman { searchParams.get("page") || "1" }</button>
        <button className="join-item btn" name="next" disabled={!hasNext} onClick={() => handlePageChange("next")}>
            <FaChevronRight />
        </button>
    </div>
}

export default Pagination