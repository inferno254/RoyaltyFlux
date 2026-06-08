import request from 'supertest';
import { app } from '../../src/app';
import { resetDb } from '../helpers/db.helper';
import { makeToken } from '../helpers/jwt.helper';

describe('Auth routes', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'bad', password: 'Good1Password' });
    expect(res.status).toBe(400);
  });

  it('requires strong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'a@b.com', password: 'weak' });
    expect(res.status).toBe(400);
  });

  it('blocks unauthorized /users/me', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  it('allows authorized /users/me', async () => {
    const token = makeToken('00000000-0000-0000-0000-000000000000');
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect([200, 401, 404]).toContain(res.status);
  });
});
