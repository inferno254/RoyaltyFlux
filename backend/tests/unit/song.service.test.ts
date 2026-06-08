import { SongService } from '../../src/services/song.service';
import { resetDb } from '../helpers/db.helper';
import { prisma } from '../../src/config/database';

describe('SongService', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('creates a song with collaborators', async () => {
    const artist = await prisma.user.create({
      data: { email: 'artist@test.com', passwordHash: 'x', role: 'ARTIST' },
    });
    const collab = await prisma.user.create({
      data: { email: 'collab@test.com', passwordHash: 'x', role: 'COLLABORATOR' },
    });

    const svc = new SongService();
    const song = await svc.create(artist.id, {
      title: 'Test Song',
      collaborators: [
        { userId: artist.id, shareBps: 7000 },
        { userId: collab.id, shareBps: 3000 },
      ],
    });

    expect(song.title).toBe('Test Song');
    expect(song.collaborators).toHaveLength(2);
  });

  it('throws on invalid collaborator id', async () => {
    const artist = await prisma.user.create({
      data: { email: 'a@b.com', passwordHash: 'x' },
    });
    const svc = new SongService();
    await expect(
      svc.create(artist.id, {
        title: 'x',
        collaborators: [{ userId: '00000000-0000-0000-0000-000000000000', shareBps: 10_000 }],
      }),
    ).rejects.toThrow();
  });
});
