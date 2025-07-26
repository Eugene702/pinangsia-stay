'use client'

import { useState, useEffect } from 'react'
import { getServices, ServiceItem } from '../action'

export const useServices = () => {
    const [services, setServices] = useState<ServiceItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchServices = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const data = await getServices()
            setServices(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch services')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
        
        // Auto refresh every 5 minutes
        const interval = setInterval(fetchServices, 5 * 60 * 1000)
        
        return () => clearInterval(interval)
    }, [])

    return {
        services,
        isLoading,
        error,
        refetch: fetchServices
    }
}
