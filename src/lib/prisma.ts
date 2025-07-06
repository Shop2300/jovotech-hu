// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Optimized Prisma configuration
const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development' 
    ? ['warn' as const, 'error' as const] // Only log warnings and errors in development
    : ['error' as const], // Only log errors in production
  errorFormat: 'minimal' as const, // Minimal error format for better performance
}

// Create Prisma client with optimizations
export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions)

// Optimize connection pool via DATABASE_URL parameters
// Add these to your DATABASE_URL in .env:
// ?connection_limit=5&pool_timeout=2&connect_timeout=5
// Example: postgresql://user:pass@host/db?connection_limit=5&pool_timeout=2&connect_timeout=5

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}