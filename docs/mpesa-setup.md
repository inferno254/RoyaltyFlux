# M-Pesa Setup

## Get sandbox credentials

1. Sign up at https://developer.safaricom.co.ke/
2. Create a new app (Lipa Na M-Pesa Sandbox)
3. Get:
   - Consumer Key
   - Consumer Secret
   - Lipa Na M-Pesa Online Passkey
   - Shortcode (default: `174379`)

## Configure

In `backend/.env`:

```env
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/api/v1/mpesa/callback
```

## Expose local callback

Safaricom requires a **publicly reachable HTTPS URL**. For local dev:

```bash
# Install ngrok
npm install -g ngrok
ngrok http 3001
# Copy the https://....ngrok-free.app URL
# Set as MPESA_CALLBACK_URL
```

## Going to production

1. Apply for a PayBill or Till number from Safaricom
2. Get production credentials (different from sandbox)
3. Set `MPESA_ENVIRONMENT=production`
4. Update `MPESA_SHORTCODE` to your production shortcode
5. Update `MPESA_CALLBACK_URL` to your production domain
6. Apply for **Initator Name** and **Security Credential** from Safaricom (for B2C payouts)

⚠️ For B2C (sending money to artists), you need to go through Safaricom's approval process and may need a signed cert.
