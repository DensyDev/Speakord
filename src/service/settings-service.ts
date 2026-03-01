import { PrismaClient } from '../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export class SettingsService {

    async setUserGender(guildId: string, userId: string, gender: string) {
        return await prisma.userSettings.upsert({
            where: {
                guildId_userId: { guildId, userId }
            },
            update: { gender },
            create: { guildId, userId, gender }
        });
    }

    async resetUserGender(guildId: string, userId: string) {
        return await prisma.userSettings.deleteMany({
            where: { guildId, userId }
        });
    }

    async getUserGender(guildId: string, userId: string): Promise<string | undefined> {
        const settings = await prisma.userSettings.findUnique({
            where: { guildId_userId: { guildId, userId } }
        });
        return settings?.gender ?? undefined;
    }

    async setGuildPrompt(guildId: string, prompt: string) {
        return await prisma.guildSettings.upsert({
            where: { guildId },
            update: { prompt },
            create: { guildId, prompt }
        });
    }

    async getGuildPrompt(guildId: string): Promise<string | undefined> {
        const settings = await prisma.guildSettings.findUnique({
            where: { guildId }
        });
        return settings?.prompt ?? undefined;
    }

    async resetGuildSettings(guildId: string) {
        return await prisma.guildSettings.delete({
            where: { guildId }
        }).catch(() => null);
    }
}