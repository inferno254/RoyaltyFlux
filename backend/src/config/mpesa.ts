import axios, { AxiosInstance } from 'axios';
import { env } from './env';
import { logger } from './logger';

const BASE = env.MPESA_ENVIRONMENT === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

export class MpesaClient {
  private http: AxiosInstance;
  private cachedToken?: { token: string; expiresAt: number };

  constructor() {
    this.http = axios.create({ baseURL: BASE, timeout: 30_000 });
  }

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now() + 60_000) {
      return this.cachedToken.token;
    }
    const key = env.MPESA_CONSUMER_KEY;
    const secret = env.MPESA_CONSUMER_SECRET;
    if (!key || !secret) throw new Error('M-Pesa credentials missing');

    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const { data } = await this.http.get('/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` },
    });
    this.cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    };
    return this.cachedToken.token;
  }

  timestamp(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      d.getFullYear() +
      pad(d.getMonth() + 1) +
      pad(d.getDate()) +
      pad(d.getHours()) +
      pad(d.getMinutes()) +
      pad(d.getSeconds())
    );
  }

  password(timestamp: string): string {
    const pass = env.MPESA_PASSKEY;
    const shortcode = env.MPESA_SHORTCODE;
    return Buffer.from(`${shortcode}${pass}${timestamp}`).toString('base64');
  }

  async stkPush(args: {
    phone: string;
    amount: number;
    accountRef: string;
    transactionDesc: string;
  }): Promise<{
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
  }> {
    const token = await this.getAccessToken();
    const ts = this.timestamp();
    const password = this.password(ts);

    const phone = this.normalizePhone(args.phone);
    const { data } = await this.http.post(
      '/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: ts,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(args.amount),
        PartyA: phone,
        PartyB: env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: env.MPESA_CALLBACK_URL,
        AccountReference: args.accountRef,
        TransactionDesc: args.transactionDesc,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return data;
  }

  async stkQuery(checkoutRequestId: string): Promise<unknown> {
    const token = await this.getAccessToken();
    const ts = this.timestamp();
    const password = this.password(ts);
    const { data } = await this.http.post(
      '/mpesa/transactionstatus/v1/query',
      {
        BusinessShortCode: env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: ts,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return data;
  }

  normalizePhone(phone: string): string {
    let p = phone.replace(/[\s+\-()]/g, '');
    if (p.startsWith('0')) p = '254' + p.slice(1);
    if (p.startsWith('7') && p.length === 9) p = '254' + p;
    if (!p.startsWith('254')) p = '254' + p;
    return p;
  }
}

export const mpesaClient = new MpesaClient();
logger.info({ env: env.MPESA_ENVIRONMENT, shortcode: env.MPESA_SHORTCODE }, 'M-Pesa client initialized');
