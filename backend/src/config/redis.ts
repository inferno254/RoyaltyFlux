import IORedis, { Redis } from 'ioredis';
import { env } from './env';
import { logger } from './logger';

let _client: Redis | null = null;

export function getRedis(): Redis {
  if (_client) return _client;
  _client = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: false,
  });
  _client.on('error', (err) => logger.error({ err }, 'Redis error'));
  _client.on('connect', () => logger.info('Redis connected'));
  return _client;
}

export async function closeRedis(): Promise<void> {
  if (_client) {
    await _client.quit();
    _client = null;
  }
}
