import * as Sentry from '@sentry/node';
import { env } from './env';

let initialized = false;

export function initSentry(): void {
  if (!env.SENTRY_DSN || initialized) return;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
  initialized = true;
}

export { Sentry };
