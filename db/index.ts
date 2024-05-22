import { PrismaClient } from '@prisma/client'

declare global {
    var cacheedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.cacheedPrisma) {
        global.cacheedPrisma = new PrismaClient();
    }
    prisma = global.cacheedPrisma
}

export const db = prisma