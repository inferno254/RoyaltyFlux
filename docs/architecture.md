# Architecture

```
┌─────────────┐     mint()      ┌──────────────────┐
│   Artist    │ ───────────────►│   RoyaltyNFT     │
│  (Frontend) │                 │  (ERC-721+2981)  │
└─────┬───────┘                 └────────┬─────────┘
      │ audio/cover                      │ stores
      │                                   ▼
      │                         ┌──────────────────┐
      ▼                         │  RoyaltySplitter │
┌─────────────┐   IPFS/Pinata  │  (per song)      │
│   IPFS      │ ◄─────────────► │  - payees[]      │
└─────────────┘                 │  - sharesBps[]   │
                                └────────┬─────────┘
                                         │ KES/USD rate
                                         ▼
                                ┌──────────────────┐
                                │  MpesaOracle     │
                                │  (Chainlink)     │
                                └────────┬─────────┘
                                         │ triggers
                                         ▼
┌─────────────┐   STK Push    ┌──────────────────────┐
│   M-Pesa    │ ◄─────────────│   Backend API        │
│  Daraja API │               │  (Express + Prisma)  │
└─────────────┘               └────────┬─────────────┘
                                         │ events
                                         ▼
                                ┌────────────────────┐
                                │  PostgreSQL        │
                                │  Redis (queues)    │
                                │  BullMQ workers    │
                                └────────────────────┘
```

## Data flow

1. Artist uploads audio + cover to backend
2. Backend pins to IPFS via Pinata
3. Backend builds NFT metadata JSON, pins it
4. Backend calls `RoyaltyNFT.mintSong(...)` on Avalanche
5. Smart contract deploys immutable `RoyaltySplitter` for the song
6. Streams are recorded on-chain via oracle role
7. Cron job calculates pending royalties, triggers M-Pesa STK Push
8. M-Pesa callback updates DB
