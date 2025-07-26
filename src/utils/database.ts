import { PrismaClient } from "@prisma/client";

// Simple logger for database operations
export const logger = {
    info: (message: string, data?: any) => {
        console.log(`[DB INFO] ${message}`, data || '')
    },
    warn: (message: string, data?: any) => {
        console.warn(`[DB WARN] ${message}`, data || '')
    },
    error: (message: string, data?: any) => {
        console.error(`[DB ERROR] ${message}`, data || '')
    }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Helper function untuk execute query dengan proper error handling
export async function executeQuery<T>(
  queryFn: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await queryFn();
    return { success: true, data };
  } catch (error: any) {
    console.error('Database query error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2024') {
      return { 
        success: false, 
        error: 'Database connection timeout. Please try again.' 
      };
    }
    
    if (error.code === 'P1001') {
      return { 
        success: false, 
        error: 'Cannot reach database server. Please check your connection.' 
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'An unexpected database error occurred.' 
    };
  }
}