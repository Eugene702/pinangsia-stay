import { PrismaClient } from '@prisma/client'
import { logger } from './database'

export class DatabaseMonitor {
    private static instance: DatabaseMonitor
    private prisma: PrismaClient
    private isHealthy: boolean = true
    private lastHealthCheck: Date = new Date()

    private constructor() {
        this.prisma = new PrismaClient({
            log: ['warn', 'error'],
        })
    }

    static getInstance(): DatabaseMonitor {
        if (!DatabaseMonitor.instance) {
            DatabaseMonitor.instance = new DatabaseMonitor()
        }
        return DatabaseMonitor.instance
    }

    async checkHealth(): Promise<{ isHealthy: boolean; message: string; details?: any }> {
        const now = new Date()
        
        // Cache health check untuk 30 detik
        if (now.getTime() - this.lastHealthCheck.getTime() < 30000 && this.isHealthy) {
            return {
                isHealthy: true,
                message: 'Database connection healthy (cached)'
            }
        }

        try {
            // Simple query untuk test connection
            const result = await Promise.race([
                this.prisma.$queryRaw`SELECT 1 as test`,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Health check timeout')), 5000)
                )
            ])

            this.isHealthy = true
            this.lastHealthCheck = now

            logger.info('Database health check passed')
            
            return {
                isHealthy: true,
                message: 'Database connection healthy',
                details: { lastCheck: now, result }
            }
        } catch (error: any) {
            this.isHealthy = false
            this.lastHealthCheck = now

            const errorDetails = {
                code: error.code,
                message: error.message,
                timestamp: now
            }

            if (error.code === 'P2024') {
                logger.error('Database connection pool timeout detected', errorDetails)
                return {
                    isHealthy: false,
                    message: 'Database connection pool is exhausted. Please try again in a moment.',
                    details: errorDetails
                }
            }

            if (error.message.includes('timeout')) {
                logger.error('Database health check timeout', errorDetails)
                return {
                    isHealthy: false,
                    message: 'Database response timeout. Server may be under heavy load.',
                    details: errorDetails
                }
            }

            logger.error('Database health check failed', errorDetails)
            return {
                isHealthy: false,
                message: 'Database connection failed. Please contact support if this persists.',
                details: errorDetails
            }
        }
    }

    async getConnectionInfo(): Promise<any> {
        try {
            const result = await this.prisma.$queryRaw`
                SELECT 
                    count(*) as active_connections,
                    current_setting('max_connections') as max_connections
                FROM pg_stat_activity 
                WHERE state = 'active'
            `
            return result
        } catch (error) {
            logger.error('Failed to get connection info', error)
            return null
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.prisma.$disconnect()
            logger.info('Database monitor disconnected')
        } catch (error) {
            logger.error('Error disconnecting database monitor', error)
        }
    }
}

// Global health check helper
export async function checkDatabaseHealth() {
    const monitor = DatabaseMonitor.getInstance()
    return await monitor.checkHealth()
}

// Connection info helper
export async function getDatabaseConnectionInfo() {
    const monitor = DatabaseMonitor.getInstance()
    return await monitor.getConnectionInfo()
}

// Graceful shutdown helper
export async function shutdownDatabaseMonitor() {
    const monitor = DatabaseMonitor.getInstance()
    await monitor.disconnect()
}
