# Local Development

## Prerequisites

- Node.js 20+
- Docker + Docker Compose
- Foundry (`curl -L https://foundry.paradigm.xyz | bash && foundryup`)
- MetaMask or Core Wallet (for testing)

## Quickstart

```bash
git clone https://github.com/inferno254/RoyaltyFlux.git
cd RoyaltyFlux

# Start infra
docker compose up -d postgres redis

# Backend
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Frontend (new terminal)
cd ../frontend
cp .env.example .env
npm install
npm run dev

# Contracts (new terminal)
cd ../contracts
forge install
forge build
forge test
```

Visit:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health: http://localhost:3001/health

## Test accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@royaltyflux.io | admin123! |
| Artist | sauti@royaltyflux.io | artist123! |
| Collaborator | producer@royaltyflux.io | collab123! |

## Deploy to Fuji

1. Get test AVAX: https://faucet.avax.network
2. Set `PRIVATE_KEY` in `contracts/.env`
3. `forge script script/Deploy.s.sol:Deploy --rpc-url https://api.avax-test.network/ext/bc/C/rpc --broadcast --private-key $PRIVATE_KEY`
4. Copy deployed `RoyaltyNFT` address to `backend/.env` as `CONTRACT_ADDRESS` and `frontend/.env` as `VITE_CONTRACT_ADDRESS`
