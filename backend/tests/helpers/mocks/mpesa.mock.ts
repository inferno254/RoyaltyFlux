// Mock M-Pesa client for tests
export const mpesaMock = {
  stkPush: jest.fn().mockResolvedValue({
    MerchantRequestID: 'mock-merchant-123',
    CheckoutRequestID: 'mock-checkout-456',
    ResponseCode: '0',
    ResponseDescription: 'Success',
    CustomerMessage: 'Success',
  }),
  stkQuery: jest.fn().mockResolvedValue({ ResultCode: 0, ResultDesc: 'Success' }),
};
