"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useRef } from "react"

const Modal = ({ children }: { children: ReactNode }) => {
    const ref = useRef<HTMLDialogElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const dialog = ref.current
        const isModalRoute = pathname.includes("/room-reservation/")

        if (dialog) {
            if (isModalRoute) {
                dialog.showModal()
            } else {
                dialog.close()
            }
        }
    }, [pathname])

    return <dialog ref={ref} className="modal">
        <div className="modal-box max-w-none">
            {children}
        </div>

        <div className="modal-backdrop">
            <button onClick={() => router.push("/room-reservation")}>close</button>
        </div>
    </dialog>
}

export default Modal