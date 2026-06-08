import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

export async function resetDb() {
  const tables = [
    'MpesaPayout',
    'RoyaltyDistribution',
    'Stream',
    'SongCollaborator',
    'Song',
    'ArtistProfile',
    'PasswordReset',
    'RefreshToken',
    'AuditLog',
    'User',
  ];
  for (const t of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${t}" CASCADE;`);
  }
}

export async function setupTestSchema() {
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
}
