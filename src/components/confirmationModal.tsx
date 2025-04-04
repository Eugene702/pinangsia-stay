"use client"

import { useEffect, useRef } from "react"
import { FaTimes } from "react-icons/fa"

export type ConfirmationModalProps = {
    isOpen: boolean,
    title: string,
    message: string,
    onConfirm: () => void,
    onClose: () => void,
    isLoading: boolean,
}

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onClose, isLoading }: ConfirmationModalProps) => {
    const ref = useRef<HTMLDialogElement>(null)
    const handleClose = () => {
        if (ref.current) {
            ref.current.close()
        }
        onClose()
    }

    useEffect(() => {
        if (ref.current) {
            if (isOpen) {
                ref.current.showModal()
            } else {
                ref.current.close()
            }
        }
    }, [isOpen])

    return <dialog ref={ref} className="modal">
        <div className="modal-box">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{title}</h3>
                <button type="button" className="btn btn-circle btn-ghost btn-sm" disabled={isLoading} onClick={handleClose}>
                    <FaTimes />
                </button>
            </div>
            <p className="py-4">{message}</p>
            <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={handleClose} disabled={isLoading}>Batalkan!</button>
                <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={isLoading}>
                    { isLoading ? <div className="loading"></div> : null }
                    <span>Ya, lanjutkan!</span>
                </button>
            </div>
        </div>
        <div className="modal-backdrop">
            <button disabled={isLoading} onClick={handleClose}>close</button>
        </div>
    </dialog>
}

export default ConfirmationModal