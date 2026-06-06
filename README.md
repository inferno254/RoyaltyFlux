# RoyaltyFlux

## Constant Royalty Flow — Artists Get Paid Instantly

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)
![Avalanche](https://img.shields.io/badge/Avalanche-C--Chain-E84142?logo=avalanche)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node-18+-339933?logo=nodedotjs)
![Foundry](https://img.shields.io/badge/Foundry-Latest-FFD466?logo=ethereum)

> Built for East African artists. Royalties in 5 minutes, not 6 months.

---

## The Problem

| Reality | What They Earn | What They Should Earn |
|---------|----------------|----------------------|
| Sauti Sol — 10M streams | 50,000 KES | 5,000,000 KES |
| Octopizzo — 1M views | 5,000 KES | 100,000 KES |

Root causes: middlemen take 80%, payments delayed 6–12 months, no transparency, manual royalty splits.

---

## The Solution

RoyaltyFlux mints songs as NFTs on **Avalanche C-Chain**. Smart contracts automatically split and pay royalties in **5 minutes** via M-Pesa.

**Flow:** Upload → Mint NFT → Stream Detected → Auto-Split → M-Pesa

**Core stack:**
- **Smart Contracts:** Solidity (Foundry) — royalty splitting, NFT minting, payment logic
- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Blockchain:** Avalanche C-Chain (EVM-compatible, sub-2s finality, <$0.01 tx fees)
- **Oracle:** Chainlink (stream verification, price feeds)
- **Storage:** IPFS / Pinata (decentralized audio + cover art)
- **Payments:** M-Pesa Daraja API (STK Push)

---

## Project Structure

```
RoyaltyFlux/
├── contracts/                  # Foundry Solidity project
├── backend/                    # Node.js API server
├── .env.example
├── .gitignore
└── README.md
```

## Quickstart

```bash
git clone -b Setup-phase/dev https://github.com/inferno254/RoyaltyFlux.git
cd RoyaltyFlux
```

## Security Architecture

RoyaltyFlux handles real money (KES via M-Pesa, AVAX on-chain). Security is enforced by design.

- **Smart Contracts:** Pausable, OnlyOracle modifier, Input validation, Events for audit trail
- **Backend:** Helmet.js + CSP, 256-bit JWT, Rate limiting, Zod validation, bcrypt passwords
- **Frontend:** CSP, XSS prevention, CORS whitelist, HTTPS-only in production

## Threat Model

| Threat | Mitigation |
|--------|-----------|
| Reentrancy | ReentrancyGuard + Checks-Effects-Interactions |
| Oracle manipulation | Chainlink decentralized oracle |
| M-Pesa spoofing | Validate MerchantRequestID |
| Smart contract bug | Foundry fuzz testing + Slither |

---

## Scalability Design

- **Smart Contracts:** Event-driven → The Graph indexing
- **Backend:** Connection pooling, Redis caching, Bull jobs
- **Frontend:** Code splitting, CDN edge-cache, PWA

---

## Contributing

Workflow:
1. Create branch from `Setup-phase/dev`: `git checkout -b feature/my-feature`
2. Complete checklist in assigned TODO file
3. Run tests + lint before opening PR
4. Open PR against `Setup-phase/dev` with 1 reviewer

Commit convention:
feat: describe the feature
fix: describe the bug fix
chore: maintenance (deps, config)
docs: README, comments only
test: adding/updating tests

---

## Environment Variables

JWT_SECRET, DATABASE_URL, PRIVATE_KEY, CONTRACT_ADDRESS, AVALANCHE_RPC, MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY, MPESA_SHORTCODE, MPESA_CALLBACK_URL, IPFS_GATEWAY, VITE_API_URL

---

## Branching Model

```
main → Setup-phase/dev → feature/*
```

## License

MIT

## Team

Built in Ongata Rongai, Kajiado County, Kenya.

---

## Roadmap

| Phase | Scope | ETA |
|-------|-------|-----|
| Setup | Contracts + backend + frontend + integrations | Now |
| Fuji Beta | 10 artists, testnet M-Pesa | 4 weeks |
| Kenya Launch | Mainnet, production M-Pesa | 8 weeks |
| Africa-wide | 50K+ artists, L2 subnet | 18 months |

<p align="center">
  <strong>RoyaltyFlux — Constant Royalty Flow. Artists Get Paid Instantly.</strong>
</p>