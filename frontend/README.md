# RoyaltyFlux Frontend

React + Vite + TypeScript + Tailwind CSS.

## Setup

```bash
cp .env.example .env
# Fill in VITE_API_URL, VITE_CONTRACT_ADDRESS, etc.
npm install
npm run dev
```

App: http://localhost:5173

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm preview` — preview production build
- `npm test` — Vitest
- `npm run lint` / `format` / `typecheck`

## Structure

```
src/
├── components/    UI components (ui, layout, auth, song, etc.)
├── context/       React context providers
├── hooks/         Custom hooks
├── lib/           api, auth, web3, ipfs, utils
├── pages/         Route components
├── services/      API clients
├── store/         Zustand stores
├── styles/        Global CSS
├── test/          Test setup + mocks
└── types/         TypeScript types
```
