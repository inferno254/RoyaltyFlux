# API Reference

Base URL: `http://localhost:3001/api/v1`

## Auth

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | `{ email, password, phone?, walletAddress?, role?, displayName? }` | Create account |
| POST | `/auth/login` | `{ email, password }` | Get tokens |
| POST | `/auth/refresh` | `{ refreshToken }` | Refresh access token |
| POST | `/auth/logout` | `{ refreshToken? }` | Revoke token |
| POST | `/auth/forgot-password` | `{ email }` | Send reset link |
| POST | `/auth/reset-password` | `{ token, password }` | Reset password |

## Songs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/songs?page=&limit=&q=&genre=&status=` | List songs |
| GET | `/songs/:id` | Get song |
| POST | `/songs` | Create draft song (auth) |
| POST | `/songs/:id/audio` | Upload audio (multipart) |
| POST | `/songs/:id/cover` | Upload cover (multipart) |
| POST | `/songs/:id/build-metadata` | Build IPFS metadata |
| DELETE | `/songs/:id` | Delete draft |

## NFT

| Method | Path | Description |
|--------|------|-------------|
| POST | `/nfts/mint` | Mint song as NFT (auth) |
| GET | `/nfts/:tokenId` | On-chain info |
| POST | `/nfts/record-streams` | Admin: report streams |

## Royalties

| Method | Path | Description |
|--------|------|-------------|
| GET | `/royalties/me/earnings` | Auth user's earnings |
| GET | `/royalties/songs/:id/calculate` | Pending distribution |
| GET | `/royalties/songs/:id/distributions` | Past distributions |

## M-Pesa

| Method | Path | Description |
|--------|------|-------------|
| POST | `/mpesa/stkpush` | Initiate STK push (auth) |
| POST | `/mpesa/callback` | Daraja callback (no auth) |
| GET | `/mpesa/status/:checkoutRequestId` | Query status |

## Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/stats` | Platform stats |
| GET | `/admin/users` | List users |
| POST | `/admin/users/:id/deactivate` | Deactivate user |
