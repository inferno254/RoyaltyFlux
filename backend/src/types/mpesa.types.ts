export interface MpesaStkPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface MpesaStkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage?: string;
}

export interface MpesaCallbackItem {
  Name: string;
  Value: string | number | null;
}

export interface MpesaCallbackMetadata {
  Item: MpesaCallbackItem[];
}

export interface MpesaCallbackBody {
  stkCallback: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResultCode: number;
    ResultDesc: string;
    CallbackMetadata?: MpesaCallbackMetadata;
  };
}

export interface MpesaCallbackEnvelope {
  Body: MpesaCallbackBody;
}
