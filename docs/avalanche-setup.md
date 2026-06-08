# Avalanche Setup

## Networks

| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| Fuji Testnet | 43113 | https://api.avax-test.network/ext/bc/C/rpc | https://testnet.snowtrace.io |
| C-Chain Mainnet | 43114 | https://api.avax.network/ext/bc/C/rpc | https://snowtrace.io |

## Get test AVAX

- https://faucet.avax.network/
- Discord faucet: https://discord.gg/RwXY7P6

## Add network to wallet

**Fuji:**
- Network name: Avalanche Fuji C-Chain
- RPC: https://api.avax-test.network/ext/bc/C/rpc
- Chain ID: 43113
- Currency: AVAX
- Explorer: https://testnet.snowtrace.io

## Get SnowTrace API key (for contract verification)

1. Sign up at https://snowtrace.io/
2. Generate API key in account settings
3. Set `SNOWTRACE_API_KEY` in `contracts/.env`

## Verify deployed contract

```bash
forge verify-contract <address> src/RoyaltyNFT.sol:RoyaltyNFT \
  --chain-id 43113 \
  --etherscan-api-key $SNOWTRACE_API_KEY
```

## Mainnet checklist

- [ ] External security audit completed
- [ ] Multi-sig for platform treasury
- [ ] Deployer key rotated to hardware wallet / Vault
- [ ] Bug bounty launched
- [ ] Emergency pause tested
- [ ] SnowTrace verification done
- [ ] M-Pesa production credentials active
