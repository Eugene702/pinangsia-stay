// Utility to detect if we're in a modal context (intercepting route)
export const isInModal = (): boolean => {
    if (typeof window === 'undefined') return false
    
    // Check if current path matches modal pattern
    const currentPath = window.location.pathname
    
    // Check if we're in intercepting route context by looking for modal indicators
    const isInterceptedRoute = document.querySelector('dialog[open]') !== null
    
    return isInterceptedRoute
}

// Alternative method using URL pattern
export const isModalRoute = (pathname?: string): boolean => {
    if (typeof window === 'undefined') return false
    
    const path = pathname || window.location.pathname
    
    // If the path contains room-reservation with ID and we have an open dialog, it's likely a modal
    const hasRoomReservationId = /\/room-reservation\/[^\/]+$/.test(path)
    const hasOpenDialog = document.querySelector('dialog[open]') !== null
    
    return hasRoomReservationId && hasOpenDialog
}
