import { PrismaClient, UserRole, SongStatus, MpesaTxStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin
  const adminHash = await bcrypt.hash('admin123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@royaltyflux.io' },
    update: {},
    create: {
      email: 'admin@royaltyflux.io',
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  // Sample artist
  const artistHash = await bcrypt.hash('artist123!', 12);
  const artist = await prisma.user.upsert({
    where: { email: 'sauti@royaltyflux.io' },
    update: {},
    create: {
      email: 'sauti@royaltyflux.io',
      passwordHash: artistHash,
      role: UserRole.ARTIST,
      isVerified: true,
      phone: '+254712345678',
      artistProfile: {
        create: {
          displayName: 'Sauti Sol',
          bio: 'Multi-award winning Kenyan afro-pop band',
          verified: true,
        },
      },
    },
  });

  // Sample collaborator
  const collabHash = await bcrypt.hash('collab123!', 12);
  const collab = await prisma.user.upsert({
    where: { email: 'producer@royaltyflux.io' },
    update: {},
    create: {
      email: 'producer@royaltyflux.io',
      passwordHash: collabHash,
      role: UserRole.COLLABORATOR,
      isVerified: true,
      phone: '+254798765432',
    },
  });

  // Sample song
  await prisma.song.upsert({
    where: { id: 'seed-song-1' },
    update: {},
    create: {
      id: 'seed-song-1',
      title: 'Melanin',
      description: 'Afro-pop celebration of African beauty',
      genre: 'Afro-pop',
      durationSec: 215,
      artistId: artist.id,
      status: SongStatus.MINTED,
      ipfsAudioHash: 'QmSampleMelaninAudio',
      ipfsCoverHash: 'QmSampleMelaninCover',
      ipfsMetadataUri: 'ipfs://QmSampleMelaninMeta/metadata.json',
      tokenId: BigInt(1),
      contractAddress: '0x0000000000000000000000000000000000000001',
      splitterAddress: '0x0000000000000000000000000000000000000002',
      releaseDate: new Date('2024-01-15'),
      collaborators: {
        create: [
          { userId: artist.id, shareBps: 7000 },
          { userId: collab.id, shareBps: 3000 },
        ],
      },
    },
  });

  console.log('Seed complete');
  console.log('Admin: admin@royaltyflux.io / admin123!');
  console.log('Artist: sauti@royaltyflux.io / artist123!');
  console.log('Collab: producer@royaltyflux.io / collab123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
