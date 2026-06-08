# Security

## Reporting a vulnerability

**Please do not file public issues for security vulnerabilities.** Email security@royaltyflux.io (or open a private security advisory on GitHub).

We will respond within 48 hours.

## Threat model

| Threat | Mitigation |
|--------|-----------|
| Reentrancy | ReentrancyGuard + Checks-Effects-Interactions |
| Oracle manipulation | Chainlink decentralized feeds + manual override |
| M-Pesa spoofing | Validate `MerchantRequestID`, signature verification |
| Smart contract bug | Foundry fuzz + Slither + external audit (mainnet) |
| Frontend XSS | React escaping, CSP headers, sanitized inputs |
| API abuse | Rate limiting (express-rate-limit), JWT, Zod validation |
| DB injection | Prisma (parameterized queries) |
| Brute force auth | bcrypt 12 rounds + auth rate limit (5/15min) |

## Best practices

- Never commit secrets — use `.env` (gitignored)
- Deployer wallet must be **separate** from any user wallet
- Multi-sig for platform treasury on mainnet
- Bug bounty planned for mainnet launch
