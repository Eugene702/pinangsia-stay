"use client"

import { useState, useEffect } from "react"
import { SweetAlertIcon } from "sweetalert2"

interface ModalErrorDisplayProps {
    message: string
    type: SweetAlertIcon
    show: boolean
    onClose: () => void
    duration?: number
}

const ModalErrorDisplay = ({ message, type, show, onClose, duration = 3000 }: ModalErrorDisplayProps) => {
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [show, duration, onClose])

    if (!show) return null

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50 border-green-200',
                    icon: 'text-green-600',
                    text: 'text-green-800',
                    iconSymbol: '✓'
                }
            case 'error':
                return {
                    bg: 'bg-red-50 border-red-200',
                    icon: 'text-red-600',
                    text: 'text-red-800',
                    iconSymbol: '✕'
                }
            case 'warning':
                return {
                    bg: 'bg-yellow-50 border-yellow-200',
                    icon: 'text-yellow-600',
                    text: 'text-yellow-800',
                    iconSymbol: '!'
                }
            case 'info':
                return {
                    bg: 'bg-blue-50 border-blue-200',
                    icon: 'text-blue-600',
                    text: 'text-blue-800',
                    iconSymbol: 'i'
                }
            case 'question':
                return {
                    bg: 'bg-purple-50 border-purple-200',
                    icon: 'text-purple-600',
                    text: 'text-purple-800',
                    iconSymbol: '?'
                }
            default:
                return {
                    bg: 'bg-gray-50 border-gray-200',
                    icon: 'text-gray-600',
                    text: 'text-gray-800',
                    iconSymbol: '•'
                }
        }
    }

    const styles = getStyles()

    return (
        <div className={`${styles.bg} border rounded-lg p-4 mb-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-300`}>
            <div className="flex items-center space-x-3">
                <div className={`${styles.icon} w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-bold`}>
                    {styles.iconSymbol}
                </div>
                <span className={`${styles.text} text-sm font-medium`}>
                    {message}
                </span>
            </div>
            <button
                onClick={onClose}
                className={`${styles.icon} hover:opacity-70 transition-opacity text-lg font-bold`}
            >
                ×
            </button>
        </div>
    )
}

export default ModalErrorDisplay
