import { NextRequest, NextResponse } from 'next/server'
import { checkDatabaseHealth, getDatabaseConnectionInfo } from '@/utils/dbMonitor'

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const detailed = url.searchParams.get('detailed') === 'true'

        const healthCheck = await checkDatabaseHealth()
        
        let connectionInfo = null
        if (detailed && healthCheck.isHealthy) {
            connectionInfo = await getDatabaseConnectionInfo()
        }

        const response = {
            status: healthCheck.isHealthy ? 'healthy' : 'unhealthy',
            message: healthCheck.message,
            timestamp: new Date().toISOString(),
            ...(detailed && { 
                details: healthCheck.details,
                connectionInfo 
            })
        }

        return NextResponse.json(response, {
            status: healthCheck.isHealthy ? 200 : 503
        })
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Health check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}
