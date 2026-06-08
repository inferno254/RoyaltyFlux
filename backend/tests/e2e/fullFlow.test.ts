import request from 'supertest';
import { app } from '../../src/app';
import { resetDb } from '../helpers/db.helper';

describe('Health', () => {
  beforeEach(async () => {
    await resetDb();
  });

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/unknown returns 404', async () => {
    const res = await request(app).get('/api/v1/unknown');
    expect(res.status).toBe(404);
  });
});
