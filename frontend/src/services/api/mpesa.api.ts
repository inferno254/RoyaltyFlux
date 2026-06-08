import { api } from '../../lib/api';

export const mpesaApi = {
  stkPush: (data: { phone: string; amount: number; accountRef: string; transactionDesc: string }) =>
    api.post('/mpesa/stkpush', data),
  status: (checkoutRequestId: string) => api.get(`/mpesa/status/${checkoutRequestId}`),
  list: (limit = 50) => api.get('/mpesa/list', { params: { limit } }),
};
