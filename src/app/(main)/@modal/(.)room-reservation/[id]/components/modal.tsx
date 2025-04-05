"use client"

import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useRef } from "react"

const Modal = ({ children }: { children: ReactNode }) => {
    const ref = useRef<HTMLDialogElement>(null)
    const router = useRouter()

    useEffect(() => {
        const dialog = ref.current
        if (dialog) {
            dialog.showModal()
        }
        return () => {
            if (dialog) {
                dialog.close()
            }
        }
    }, [])

    return <dialog ref={ref} className="modal">
        <div className="modal-box max-w-none">
            {children}
        </div>

        <div className="modal-backdrop">
            <button onClick={() => router.back()}>close</button>
        </div>
    </dialog>
}

export default Modal