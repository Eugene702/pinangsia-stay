import withReactContent from "sweetalert2-react-content"
import SweetAlert, { SweetAlertIcon } from "sweetalert2"
import { isInModal } from "./modalDetection"

// Global modal error state management
let modalErrorCallback: ((type: SweetAlertIcon, message: string) => void) | null = null

export const setModalErrorCallback = (callback: (type: SweetAlertIcon, message: string) => void) => {
    modalErrorCallback = callback
}

export const clearModalErrorCallback = () => {
    modalErrorCallback = null
}

// Smart toast function that detects context
export const showToast = (icon: SweetAlertIcon, title: string, duration?: number) => {
    // Check if we're in modal context
    if (isInModal() && modalErrorCallback) {
        // Use modal error display instead of toast
        modalErrorCallback(icon, title)
        return
    }
    
    // Use regular toast for normal pages
    showCustomToast(icon, title, duration)
}

// Custom toast function with guaranteed highest z-index
export const showCustomToast = (icon: SweetAlertIcon, title: string, duration?: number) => {
    // Create custom toast element
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('custom-toast-container')
    if (!toastContainer) {
        toastContainer = document.createElement('div')
        toastContainer.id = 'custom-toast-container'
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2147483647;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `
        document.body.appendChild(toastContainer)
    }

    // Create toast element
    const toast = document.createElement('div')
    toast.id = toastId
    toast.style.cssText = `
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 350px;
        min-width: 250px;
        pointer-events: auto;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        border: 1px solid rgba(0, 0, 0, 0.1);
        z-index: 2147483647;
        position: relative;
    `

    // Create icon
    const iconElement = document.createElement('div')
    iconElement.style.cssText = `
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 14px;
        font-weight: bold;
    `

    // Set icon based on type
    switch (icon) {
        case 'success':
            iconElement.style.backgroundColor = '#10b981'
            iconElement.style.color = 'white'
            iconElement.innerHTML = '✓'
            break
        case 'error':
            iconElement.style.backgroundColor = '#ef4444'
            iconElement.style.color = 'white'
            iconElement.innerHTML = '✕'
            break
        case 'warning':
            iconElement.style.backgroundColor = '#f59e0b'
            iconElement.style.color = 'white'
            iconElement.innerHTML = '!'
            break
        case 'info':
            iconElement.style.backgroundColor = '#3b82f6'
            iconElement.style.color = 'white'
            iconElement.innerHTML = 'i'
            break
        default:
            iconElement.style.backgroundColor = '#6b7280'
            iconElement.style.color = 'white'
            iconElement.innerHTML = '•'
    }

    // Create title
    const titleElement = document.createElement('div')
    titleElement.textContent = title
    titleElement.style.cssText = `
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        flex-grow: 1;
        line-height: 1.4;
    `

    // Create close button
    const closeButton = document.createElement('button')
    closeButton.innerHTML = '×'
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: #9ca3af;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        flex-shrink: 0;
    `
    closeButton.addEventListener('click', () => hideToast())

    // Assemble toast
    toast.appendChild(iconElement)
    toast.appendChild(titleElement)
    toast.appendChild(closeButton)
    toastContainer.appendChild(toast)

    // Show animation
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)'
    })

    // Auto hide
    const hideToast = () => {
        toast.style.transform = 'translateX(100%)'
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast)
            }
        }, 300)
    }

    setTimeout(hideToast, duration || 3000)
}

// Keep the old SweetAlert2 version as fallback (but commented out for now)
export const showToastSweetAlert = (icon: SweetAlertIcon, title: string, duration?: number) => {
    const Swal = withReactContent(SweetAlert)
    Swal.fire({
        icon,
        title,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: duration || 3000,
        backdrop: false,
        allowOutsideClick: true,
        allowEscapeKey: false,
        stopKeydownPropagation: false,
        customClass: {
            container: 'toast-container-z-index'
        },
        didOpen: (toast) => {
            toast.style.zIndex = '2147483647'
            toast.parentElement!.style.zIndex = '2147483647'
        }
    })
}