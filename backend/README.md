# RoyaltyFlux Backend

Node.js + Express + TypeScript + Prisma + PostgreSQL.

## Setup

```bash
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, M-Pesa creds, etc.
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

API: http://localhost:3001/api/v1

## Scripts

- `npm run dev` — dev server with watch
- `npm run build` — compile TS
- `npm start` — run compiled JS
- `npm test` — Jest tests
- `npm run prisma:studio` — DB GUI
- `npm run lint` / `format` / `typecheck`

## Structure

```
src/
├── config/         env, db, blockchain, mpesa, ipfs, redis
├── controllers/    HTTP handlers
├── services/       Business logic
├── routes/         Express routers
├── middlewares/    auth, validate, error, rate limit, upload
├── validators/     Zod schemas
├── queues/         BullMQ queues
├── workers/        Background workers
├── jobs/           Cron jobs
├── sockets/        Socket.io
├── types/          Type defs
├── utils/          Helpers
├── app.ts          Express app
└── server.ts       Bootstrap
```
