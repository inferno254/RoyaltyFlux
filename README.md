# RoyaltyFlux

## Constant Royalty Flow — Artists Get Paid Instantly

> Built for East African artists. Royalties in 5 minutes, not 6 months.

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![Avalanche](https://img.shields.io/badge/Avalanche-C--Chain-E84142?logo=avalanche)](https://avax.network/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Node](https://img.shields.io/badge/Node-18+-339933?logo=node.js)](https://nodejs.org/)
[![Foundry](https://img.shields.io/badge/Foundry-Latest-FF4666?logo=ethereum)](https://book.getfoundry.sh/)

> **Security-first payments prototype** — Handles real money (KES via M-Pesa, AVAX on-chain). Security hardened by design.

---

## The Problem

| Reality | What They Earn | What They Should Earn |
|---------|----------------|----------------------|
| Spotify | 10M streams | 50,000 KES | 500,000 KES |
| Octopizzo | 1M views | 5,000 KES | 100,000 KES |

Root causes: middlemen take 80%, payments delayed 12+ months, no transparency, manual royalty splits.

---

## The Solution

RoyaltyFlux mints songs as NFTs on **Avalanche C-Chain**. Smart contracts automatically split and pay royalties in **5 minutes** via M-Pesa.

**Flow:** Upload → Mint NFT → Stream Detected → Auto-Split → M-Pesa

---

## Core Stack

- **Smart Contracts:** Solidity (Foundry) — royalty splitting, NFT minting, payment logic
- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Blockchain:** Avalanche C-Chain (EVM-compatible, sub-2s finality, <$0.01 tx fees)
- **Oracles:** Chainlink (stream verification, price feeds)
- **Storage:** IPFS / Pinata (decentralized audio + cover art)
- **Payments:** M-Pesa Daraja API (STK Push)

---

## Security Architecture

### Smart Contract Security
- **ReentrancyGuard** — OpenZeppelin reentrancy protection on all payment functions
- **Checks-Effects-Interactions** pattern enforced
- **Input validation** — All external calls validated, Zod schemas on backend
- **Events for audit trail** — Every royalty split, payment, mint logged on-chain
- **Pausable** — Emergency circuit breaker for contract admin

### Backend Security
- **Helmet.js + CSP** — HTTP security headers
- **256-bit JWT** — HS256 signing, short expiry, refresh rotation
- **Rate limiting** — Express rate-limit on all endpoints
- **Zod validation** — All request bodies validated
- **bcrypt password hashing** — 12 rounds

### M-Pesa Payment Security
- **Validate MerchantRequestID** — Prevent replay attacks
- **IP allowlist** — Safaricom callback IPs only
- **Advisory locks** — Prevent duplicate callback processing
- **Amount + reference validation** — Before confirming payment
- **C2B routes canonical** — Under `/payments/c2b/*` (legacy `/payments/*` aliases preserved)

### Infrastructure
- **Foundry fuzz testing** — Property-based testing on all contract functions
- **Slither static analysis** — Automated vulnerability scanning in CI
- **GitHub Actions CI** — Lint, typecheck, test, slither on every push

---

## Threat Model

| Threat | Mitigation |
|--------|------------|
| Reentrancy on payout | ReentrancyGuard + CEI pattern |
| Oracle manipulation | Chainlink decentralized oracle |
| M-Pesa callback spoofing | IP allowlist + MerchantRequestID validation |
| Smart contract bugs | Foundry fuzz + Slither + 100% coverage target |
| Private key exposure | Env-only, never committed, hardware wallet for deploy |
| Frontend XSS | CSP + React auto-escaping + Zod validation |

---

## Quickstart

```bash
git clone -b Setup-phase/dev https://github.com/inferno254/RoyaltyFlux.git
cd RoyaltyFlux
```

### Security Checklist (in assigned TODO file)
3. Run tests + lint before opening PR
4. Open PR against `Setup-phase/dev` with 1 reviewer

### Commit Convention
```
feat: describe the feature
fix: describe the bug fix
chore: maintenance (deps, config)
docs: README, comments only
test: adding/updating tests
```

---

## Branching Model

```
main                          Setup-phase/dev         feature/*
  |                              |                       |
  |--- 47 commits ahead --->     |                       |
  | (production base)            |                       |
                                 |                       |
```

Work is organized in feature branches:
- `main` — Production base (Dockerfile, CI, contracts, backend, frontend)
- `Setup-phase/dev` — Active development branch
- `feature/*` — Individual features

---

## License

MIT

---

## Team

Built in Ongata Rongai, Kajiado County, Kenya.

---

## Roadmap

| Phase | Scope | ETA |
|-------|-------|-----|
| Setup | Contracts + Backend + Frontend + Integrations | Now |
| Fuji Beta | 10 artists, testnet M-Pesa | 4 weeks |
| Kenya Launch | Mainnet, production M-Pesa | 8 weeks |
| Africa-Wide | 50k+ artists, L2 subnet | 18 months |

---

**RoyaltyFlux — Constant Royalty Flow. Artists Get Paid Instantly.**