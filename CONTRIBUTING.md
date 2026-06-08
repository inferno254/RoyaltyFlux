# Contributing

Thank you for your interest in RoyaltyFlux! 🎵

## Workflow

1. Fork the repo
2. Create a branch from `Setup-phase/dev`:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make your changes
4. Run tests + lint:
   ```bash
   # Contracts
   cd contracts && forge test

   # Backend
   cd backend && npm run lint && npm test

   # Frontend
   cd frontend && npm run lint && npm test
   ```
5. Open a PR against `Setup-phase/dev` with 1 reviewer

## Commit convention

```
feat: add NFT minting
fix: handle M-Pesa timeout
chore: bump dependencies
docs: update README
test: add splitter fuzz tests
```

## Code style

- TypeScript strict mode
- Solidity 0.8.20, OZ contracts
- Prettier + ESLint

## Reporting issues

Use the GitHub issue templates (bug, feature).
