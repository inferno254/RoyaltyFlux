import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { env } from './env';
import { logger } from './logger';

export class IpfsService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.pinata.cloud',
      timeout: 30_000,
    });
  }

  async pinFile(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    if (!env.PINATA_JWT) {
      throw new Error('PINATA_JWT not configured');
    }
    const form = new FormData();
    form.append('file', buffer, { contentType: mimeType, filename: fileName });

    const { data } = await this.client.post('/pinning/pinFileToIPFS', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${env.PINATA_JWT}`,
      },
    });
    return data.IpfsHash as string;
  }

  async pinJSON(obj: unknown, name: string): Promise<string> {
    if (!env.PINATA_JWT) {
      throw new Error('PINATA_JWT not configured');
    }
    const { data } = await this.client.post(
      '/pinning/pinJSONToIPFS',
      { pinataContent: obj, pinataMetadata: { name } },
      { headers: { Authorization: `Bearer ${env.PINATA_JWT}`, 'Content-Type': 'application/json' } },
    );
    return data.IpfsHash as string;
  }

  gatewayUrl(hash: string): string {
    return `${env.IPFS_GATEWAY.replace(/\/$/, '')}/${hash}`;
  }
}

export const ipfsService = new IpfsService();
logger.info('IPFS service initialized (Pinata)');
