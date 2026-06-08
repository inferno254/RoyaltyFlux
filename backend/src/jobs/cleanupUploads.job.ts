import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger';

export async function cleanupUploadsJob() {
  const dir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const f of files) {
    const full = path.join(dir, f);
    try {
      const stat = fs.statSync(full);
      if (stat.isFile() && stat.mtimeMs < cutoff) {
        fs.unlinkSync(full);
        logger.info({ file: f }, 'Cleaned up stale upload');
      }
    } catch {
      // ignore
    }
  }
}
