import { logger } from '../config/logger';
import { closeRedis, getRedis } from '../config/redis';

export class CacheServiceFacade {
  // Re-exported to keep API surface stable
  async close() {
    await closeRedis();
  }
  client() {
    return getRedis();
  }
}

export const _ = logger; // keep import
