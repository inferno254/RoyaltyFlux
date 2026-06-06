# RoyaltyFlux
## Constant Royalty Flow — Artists Get Paid Instantly
# ANGAZA
> **Game-Based Micro-Earning & Financial Literacy for Neurodivergent Youth.**

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)
![Avalanche](https://img.shields.io/badge/Avalanche-C--Chain-E84142?logo=avalanche)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node-18+-339933?logo=nodedotjs)
![Foundry](https://img.shields.io/badge/Foundry-Latest-FFD466?logo=ethereum)
[!Avalanche](https://www.avax.network/)
[!KopoKopo](https://www.kopokopo.co.ke/)
[!Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/)

> Built for East African artists. Royalties in 5 minutes, not 6 months.
Built on **Avalanche** | Powered by **KopoKopo K2 Connect**

---

## The Problem We're Solving
## 🧠 Vision & Research Foundation

Kenyan musicians live in poverty while their songs get millions of streams.
Angaza is an ecosystem designed to turn cognitive differences into financial strengths. Our architecture is grounded in three converging research pillars:

| Reality | What They Earn | What They Should Earn |
|---------|---------------|----------------------|
| Sauti Sol — 10M streams | 50,000 KES | 5,000,000 KES |
| Octopizzo — 1M views | 5,000 KES | 100,000 KES |
1.  **Neurodiversity & Learning:** Based on Armstrong (2012) and the **Universal Design for Learning (UDL)** framework. We prioritize pattern recognition and hyperfocus, removing competitive pressures that typically hinder neurodivergent performance.
2.  **Intrinsic Motivation:** Leveraging **Self-Determination Theory** (Deci & Ryan, 1985). We replace volatile leaderboards with personalized progress arcs to foster competence and autonomy.
3.  **Financial Inclusion:** Utilizing the **GSMA Mobile Money Report (2024)** insights. By pairing **M-Pesa** ubiquity with **AVAX micropayments**, we create a zero-friction earning path for youth without traditional bank accounts.

**Root causes:** Middlemen take 80%, payments delayed 6–12 months, no transparency, manual royalty splits.

---

## The Solution
## 🎨 Adaptive Design Principles

RoyaltyFlux mints every song as an NFT on **Avalanche C-Chain**. Smart contracts automatically split and pay royalties in **5 minutes** via M-Pesa.
To ensure a calming and productive environment, Angaza follows strict "Neuro-First" engineering rules:

```
Upload → Mint NFT → Stream Detected → Auto-Split → M-Pesa in 5 min
```
| Feature | Action | Impact |
| :--- | :--- | :--- |
| **Competition** | **REMOVE** | Eliminates anxiety; replaces leaderboards with "Past-Self" metrics. |
| **Visuals** | **SIMPLIFY** | Removes noise-heavy animations; adds high-contrast and calming transitions. |
| **Feedback** | **ADAPT** | Replaces red "failure" states with mastery-based badges and self-paced retry logic. |
| **Learning** | **SPACED** | Implements spaced repetition for financial literacy (every 3 sessions). |

**Core stack:**
- **Smart Contracts:** Solidity (Foundry) — royalty splitting, NFT minting, payment logic
- **Backend:** Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + RainbowKit
- **Blockchain:** Avalanche C-Chain (EVM-compatible, sub-2s finality, <$0.01 tx fees)
- **Oracle:** Chainlink (stream verification, price feeds)
- **Storage:** IPFS / Pinata (decentralized audio + cover art)
- **Payments:** M-Pesa Daraja API (USD → KES conversion, STK Push)

---

## Project Structure
## 🕹️ Game Archetypes (Earning Modules)

```
RoyaltyFlux/
├── contracts/                  # Foundry Solidity project
│   ├── src/
│   │   └── RoyaltyFlux.sol     # Core smart contract
│   ├── test/
│   │   └── RoyaltyFlux.t.sol   # Foundry tests
│   ├── script/
│   │   └── Deploy.s.sol        # Deployment script
│   ├── lib/                    # OpenZeppelin, Chainlink (git submodules)
│   ├── out/                    # Compiled artifacts (ABI — do not commit)
│   └── foundry.toml
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── config/             # Environment configs
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # Express routers
│   │   ├── services/           # Business logic (blockchain, M-Pesa, IPFS)
│   │   ├── middleware/         # Auth, validation, error handling
│   │   ├── utils/              # Helpers, formatters
│   │   ├── types/              # TypeScript interfaces
│   │   └── index.ts            # Entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts
│   └── uploads/                # Temporary file storage (gitignored)
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route pages
│   │   ├── contexts/           # React Context (Auth)
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # API client, Web3 utils
│   │   ├── types/              # TypeScript interfaces
│   │   ├── stores/             # Zustand state
│   │   └── App.tsx
│   └── public/
├── TODO_1.md — TODO_6.md       # Granular task breakdown (per contributor)
├── .env.example                # Template for local environment
├── .gitignore
└── README.md
```

## Quickstart

### Prerequisites

### Install

```bash
# 1. Clone
git clone -b Setup-phase/dev https://github.com/<your-org>/RoyaltyFlux.git
cd RoyaltyFlux

# 2. Smart contracts
cd contracts
forge install OpenZeppelin/openzeppelin-contracts@v4.9.3
forge install smartcontractkit/chainlink@v1.1.0
forge install foundry-rs/forge-std
forge build
cd ..

# 3. Backend
cd backend
cp ../.env.example ../.env   # fill in values
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed          # optional: seed test data
npm run dev                  # runs on :3001

# 4. Frontend
cd ../frontend
cp ../.env.example ../.env
npm install
npm run dev                  # runs on :3000
```


## Security Architecture

RoyaltyFlux handles **real money** (KES via M-Pesa, AVAX on-chain). Security is not optional — it's enforced by design.

### Layer 1: Smart Contract Security
- **Pausable** emergency circuit breaker (owner-only, multisig in production)
- **OnlyOracle** modifier: only whitelisted Chainlink oracle can call `recordStreams`
- **Input validation:** basis point math clamped, address checks on every wallet field
- **Events for every state change:** full audit trail on-chain
- **No mutable owner override before mainnet:** single point of failure removed
- **Upgrade path:** upgradeable proxy pattern via OpenZeppelin Transparent Proxy (planned)
- **Audits:** internal Slither scan + external audit before mainnet

### Layer 2: Backend Security
- **Helmet.js** security headers + **CSP** on all responses
- **JWT:** 256-bit secret, 7-day expiry, refresh rotation
- **Rate limiting:** 100 req/15min per IP, 10 auth attempts/15min, 5 M-Pesa req/min
- **Input validation:** Zod schemas on all POST/PUT endpoints
- **SQL injection prevention:** Prisma parameterized queries only
- **Secrets management:** `.env` strictly gitignored, AWS Secrets Manager / Vault in production
- **Audit logging:** every auth event, payment, song action recorded to `audit_logs`
- **No plaintext passwords:** bcrypt with 12 rounds

### Layer 3: Frontend Security
- **CSRF protection:** SameSite cookies for sessions (planned)
- **Content Security Policy:** restricts script/style/img/connect sources
- **XSS prevention:** `DOMPurify` on any user-generated content (lyrics, bios)
- **Private keys never in client:** MetaMask / wallet connectors only
- **CORS whitelist:** only `royaltyflux.app` + localhost in production
- **HTTPS-only in prod:** enforced by hosting platform + HSTS header

### Layer 4: Infrastructure
- **Secrets:** Vault / AWS Secrets Manager (no env files on production hosts)
- **Database:** connection pooling, SSL in transit, automated daily backups
- **Redis:** auth token blacklist (for logout revocation)
- **WAF:** Cloudflare for frontend (DDoS, SQLi, bot protection)
- **Monitoring:** Sentry for error tracking, UptimeRobot for health checks
- **CI/CD:** GitHub Actions — tests must pass before merge; no direct prod deploys

### Threat Model (HAL)

| Threat | Mitigation |
|--------|-----------|
| Reentrancy on withdraw | `ReentrancyGuard` + Checks-Effects-Interactions pattern |
| Oracle manipulation | Chainlink decentralized oracle network, multiple data sources |
| Phishing / fake songs | KYC verification before minting (Phase 2), community flagging |
| M-Pesa callback spoofing | validate `MerchantRequestID` matches our DB before crediting |
| Smart contract bug | Foundry fuzz testing + Slither + production audit |
| Frontend takeover | Subresource Integrity hashes, strict CSP |
| DB breach | encrypted at rest (RDS encryption), least-privilege IAM |


## Scalability Design

### Smart Contract Layer
- **Event-driven architecture:** all state changes emit events → indexed by The Graph → frontend never reads directly from contract

### Backend Layer
- **Database:** connection pooling, read replicas for song browsing (90% reads, 10% writes)
- **Caching:** Redis for hot data (songs list, artist profiles, stream counts) → 5-min TTL
- **Background jobs:** Bull queue + Redis for async tasks (IPFS upload, M-Pesa callbacks, daily reports)
- **Message queue:** SQS / Redis Streams for decoupled payment processing

### Frontend Layer
- **Code splitting:** React.lazy per route; vendor bundle < 200KB initial
- **CDN:** Vercel / Cloudflare Pages — edge-cached static assets, sub-100ms TTFB globally
- **Image optimization:** Cloudinary transforms on-demand (w, q, f_auto)
- **PWA:** Service worker for offline browsing of cached songs

### Infrastructure
- **Database:** PostgreSQL → Citus for horizontal sharding when > 1M rows
- **Object storage:** S3-compatible (Cloudflare R2) for audio — avoids IPFS latency for streaming
- **Search:** Meilisearch / Algolia for instant song/artist search


## Contributing
This is a 2-person build. See `TODO_1.md` through `TODO_6.md` for the exact task breakdown.

**Workflow:**
1. Create a branch from `Setup-phase/dev`: `git checkout -b feature/my-feature`
2. Complete the checklist in your assigned TODO file
3. Run tests + lint before opening PR
4. Open PR against `Setup-phase/dev` with at least 1 reviewer

**Commit convention:**
```
feat: describe the feature
fix: describe the bug fix
chore: maintenance (deps, config)
docs: README, comments only
test: adding/updating tests
refactor: no functional change
```

**Before every commit:**
```bash
# Contracts
forge build && forge test -vvv

# Backend
cd backend && npm run lint && npm test && cd ..

# Frontend
cd frontend && npx tsc --noEmit && npm run build && cd ..
```


## Environment Variables

Copy `.env.example` to `.env` in each subproject. **Never commit real secrets.**

**Minimum required:**

| Variable | Where | Purpose |
|----------|-------|---------|
| `JWT_SECRET` | backend | 64+ char random string |
| `DATABASE_URL` | backend | PostgreSQL connection string |
| `PRIVATE_KEY` | backend | Deployer wallet (test only) |
| `CONTRACT_ADDRESS` | backend + frontend | Deployed RFLUX contract |
| `AVALANCHE_RPC` | backend | Avalanche node URL (Fuji for test) |
| `MPESA_CONSUMER_KEY` | backend | Safaricom Daraja sandbox key |
| `MPESA_CONSUMER_SECRET` | backend | Safaricom Daraja sandbox secret |
| `MPESA_PASSKEY` | backend | Safaricom passkey for STK Push |
| `MPESA_SHORTCODE` | backend | 174379 (sandbox) |
| `MPESA_CALLBACK_URL` | backend | Public HTTPS endpoint for callbacks |
| `IPFS_GATEWAY` | backend + frontend | Pinata or Infura gateway URL |
| `VITE_API_URL` | frontend | Backend base URL |
| `VITE_CONTRACT_ADDRESS` | frontend | Same as `CONTRACT_ADDRESS` above |

---

## Branching Model

```
main (protected, production-ready code only)
  └── Setup-phase/dev (active development — PRs target here)
        ├── feature/smart-contract-*
        ├── feature/backend-*
        ├── feature/frontend-*
        ├── feature/integrations-*
        └── chore/deps, chore/docs, fix/*
```

**Rules:**
- `main` requires 1 approving review + all CI checks green
- `Setup-phase/dev` requires passing CI; merge via PR only (no force push)
- Feature branches named `feature/<area>-<short-desc>`
- Tag releases: `v0.1.0-fuji`, `v0.2.0-beta`, `v1.0.0-mainnet`

---

## License

MIT — see [LICENSE](LICENSE).

---

## Team

Built in Ongata Rongai, Kajiado County, Kenya.

**Portion assignments (see TODO files):**
- **Odd (You):** TODO 1 (Smart Contracts) + TODO 3 (Frontend Core) + TODO 5 (Integrations)
- **Even (Partner):** TODO 2 (Backend) + TODO 4 (Frontend Advanced) + TODO 6 (Testing, Security, DevOps)

---

## Roadmap

| Phase | Scope | ETA |
|-------|-------|-----|
| **Setup** | Contracts + backend + frontend + integrations | Now |
| **Fuji Beta** | 10 artists, testnet M-Pesa, limited streams | 4 weeks |
| **Kenya Launch** | Mainnet, production M-Pesa, marketing | 8 weeks |
| **Regional** | Tanzania, Uganda, Nigeria | 6 months |
| **Africa-wide** | 50K+ artists, L2 subnet | 18 months |

---

## Acknowledgments

- OpenZeppelin for battle-tested contract libraries
- Chainlink for decentralized oracle infrastructure
- Safaricom for M-Pesa Daraja API access
- Avalanche for sub-second, sub-cent transactions

<p align="center">
  <strong>RoyaltyFlux — Constant Royalty Flow. Artists Get Paid Instantly.</strong>
</p>
