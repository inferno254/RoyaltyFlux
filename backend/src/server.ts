import { createServer } from 'http';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initSocket } from './sockets';
import { startWorkers } from './workers';
import { scheduleJobs } from './jobs';

async function bootstrap() {
  try {
    await connectDatabase();
    logger.info('Database connected');
  } catch (err) {
    logger.error({ err }, 'Database connection failed');
    process.exit(1);
  }

  const httpServer = createServer(app);
  initSocket(httpServer);

  if (env.NODE_ENV !== 'test') {
    startWorkers().catch((err) => logger.error({ err }, 'Worker startup failed'));
    scheduleJobs();
  }

  httpServer.listen(env.PORT, () => {
    logger.info(`🚀 RoyaltyFlux API listening on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully...`);
    httpServer.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'Uncaught exception');
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    logger.fatal({ reason }, 'Unhandled rejection');
    process.exit(1);
  });
}

bootstrap();
