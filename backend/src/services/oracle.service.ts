import { getMpesaOracleContract, provider } from '../config/blockchain';
import { ethers } from 'ethers';
import { logger } from '../config/logger';
import { KES_PER_USD_DEFAULT } from '../utils/constants';

export class OracleService {
  async getKesUsdRate(): Promise<{ rate: number; isStale: boolean }> {
    try {
      const oracle = getMpesaOracleContract();
      const [rate, isStale] = await oracle.getKesUsdRate();
      return { rate: Number(rate) / 1e8, isStale };
    } catch (err) {
      logger.warn({ err }, 'Oracle call failed, using default');
      return { rate: KES_PER_USD_DEFAULT, isStale: true };
    }
  }

  async computePayout(tier: number, streamCount: number): Promise<string> {
    try {
      const oracle = getMpesaOracleContract();
      const amount = await oracle.computePayout(tier, streamCount);
      return ethers.formatEther(amount);
    } catch (err) {
      logger.warn({ err }, 'computePayout failed, using default 0.10 KES');
      return (streamCount * 0.10).toString();
    }
  }
}

export const oracleService = new OracleService();
