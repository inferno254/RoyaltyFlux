# Threat Model

## Assets

1. **User funds** — M-Pesa payouts, AVAX on-chain
2. **Personal data** — email, phone, wallet addresses
3. **IP** — song files on IPFS, NFT metadata
4. **Smart contracts** — locked value in splitters

## Adversaries

| Adversary | Capability | Goal |
|-----------|-----------|------|
| External attacker | Internet access | Drain funds / steal data |
| Malicious user | Valid account | Fraudulent payouts |
| Compromised oracle | Sign oracle txs | Inflate stream counts |
| Compromised deployer | Sign txs | Drain treasury |
| Insider | Source access | Backdoor |

## Attack vectors & mitigations

### Smart contract

| Attack | Mitigation |
|--------|-----------|
| Reentrancy | `nonReentrant` + CEI pattern |
| Integer overflow | Solidity 0.8 default + SafeMath |
| Access bypass | `AccessControl` with strict roles |
| Front-running | Acceptable for mints (low value) |
| Oracle manipulation | Chainlink + manual override |
| Griefing | Pausable + per-token rate limits |

### Backend

| Attack | Mitigation |
|--------|-----------|
| SQL injection | Prisma parameterized queries |
| XSS | React escaping + CSP |
| CSRF | JWT in header (not cookie) |
| Brute force | bcrypt + rate limit (5/15min) |
| DoS | Rate limit + body size limit (10mb) |
| Auth bypass | JWT signature + expiry |
| M-Pesa replay | Validate `MerchantRequestID` + signature |
| IPFS spoofing | Pin via Pinata, hash verified client-side |

### Frontend

| Attack | Mitigation |
|--------|-----------|
| XSS | React default escaping + no `dangerouslySetInnerHTML` |
| Wallet phishing | `wallet_switchEthereumChain` only on user action |
| CORS | Strict allowlist in backend |
| Dependency supply chain | Dependabot + `npm audit` in CI |

## Out of scope

- Nation-state adversaries
- Physical attacks on user devices
- Compromised user wallets (user error)
- Safaricom API compromise
