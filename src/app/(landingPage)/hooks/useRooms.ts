import { useState, useEffect, useCallback } from 'react'
import { getRoomCategories, FormattedRoomCategory } from '../action'

interface UseRoomsReturn {
    rooms: FormattedRoomCategory[]
    isLoading: boolean
    error: string | null
    refetch: () => Promise<void>
}

export const useRooms = (): UseRoomsReturn => {
    const [rooms, setRooms] = useState<FormattedRoomCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchRooms = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            const roomCategories = await getRoomCategories()
            setRooms(roomCategories)
        } catch (error) {
            console.error('Failed to load room categories:', error)
            setError(error instanceof Error ? error.message : 'Failed to load rooms')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])

    // Auto-refresh every 5 minutes to keep data fresh
    useEffect(() => {
        const interval = setInterval(() => {
            fetchRooms()
        }, 5 * 60 * 1000) // 5 minutes

        return () => clearInterval(interval)
    }, [fetchRooms])

    return {
        rooms,
        isLoading,
        error,
        refetch: fetchRooms
    }
}
