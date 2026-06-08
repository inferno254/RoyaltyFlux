# Smart Contracts

## RoyaltyNFT

`ERC-721` token representing a song. Each token has an immutable `RoyaltySplitter` that holds AVAX + ERC-20 royalties.

### Roles

- `DEFAULT_ADMIN_ROLE` — admin (granted to deployer)
- `MINTER_ROLE` — backend signer (mints new songs)
- `ORACLE_ROLE` — oracle backend (records streams)

### Functions

#### `mintSong(artist, tokenURI, collaborators, sharesBps, songHash) → uint256`
- `artist` — initial owner
- `tokenURI` — IPFS URI of metadata JSON
- `collaborators` — list of recipient addresses (must be sorted ascending)
- `sharesBps` — basis points, must sum to 10_000
- `songHash` — keccak256 to prevent duplicates

#### `recordStreams(tokenId, streamCount)`
Only callable by oracle. Adds to song's stream total.

### Events

- `SongMinted(tokenId, artist, splitter, songHash, timestamp)`
- `StreamsRecorded(tokenId, streamCount, totalStreams, oracle)`

## RoyaltySplitter

Holds native AVAX + (TODO) ERC-20. Splits among payees by immutable share.

```solidity
release(payable(account))  // withdraw your share
releaseAll()               // anyone can trigger for all
pendingRelease(account)    // view function
```

## MpesaOracle

Returns KES/USD rate from Chainlink price feed, with a manual fallback.

```solidity
getKesUsdRate() → (uint256 rate, bool isStale)
computePayout(tier, streamCount) → uint256
```

## PlatformTreasury

Holds the platform's cut of NFT mint fees and ERC-2981 royalties.

## Deployment (Fuji testnet)

```bash
cd contracts
cp .env.example .env
# Add PRIVATE_KEY
forge install foundry-rs/forge-std --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install smartcontractkit/chainlink --no-commit
forge build
forge test -vv
forge script script/Deploy.s.sol:Deploy --rpc-url $AVALANCHE_RPC --broadcast --private-key $PRIVATE_KEY
```
