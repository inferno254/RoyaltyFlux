// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IRoyaltyNFT} from "./interfaces/IRoyaltyNFT.sol";
import {IRoyaltySplitter} from "./interfaces/IRoyaltySplitter.sol";

/// @title RoyaltyNFT
/// @notice ERC-721 NFT representing a song, with on-chain royalty splits
/// @dev Each token is bound to an immutable RoyaltySplitter that holds payout shares
contract RoyaltyNFT is
    ERC721,
    ERC721URIStorage,
    ERC2981,
    Ownable,
    Pausable,
    ReentrancyGuard,
    AccessControl,
    IRoyaltyNFT
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    uint256 private _nextTokenId;
    address public immutable platformTreasury;
    uint96 public platformFeeBps; // basis points (e.g. 250 = 2.5%)

    mapping(uint256 tokenId => SongInfo) private _songs;
    mapping(address artist => uint256[] tokenIds) private _artistTokens;
    mapping(bytes32 songHash => bool) private _registeredHashes;

    constructor(
        address admin_,
        address platformTreasury_,
        uint96 platformFeeBps_
    ) ERC721("RoyaltyFlux Song", "RFLX") Ownable(admin_) {
        require(platformTreasury_ != address(0), "RoyaltyNFT: zero treasury");
        require(platformFeeBps_ <= 1000, "RoyaltyNFT: fee too high"); // max 10%
        platformTreasury = platformTreasury_;
        platformFeeBps = platformFeeBps_;
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(MINTER_ROLE, admin_);
    }

    /// @inheritdoc IRoyaltyNFT
    function mintSong(
        address artist,
        string calldata tokenURI,
        address[] calldata collaborators,
        uint256[] calldata sharesBps,
        bytes32 songHash
    ) external override onlyRole(MINTER_ROLE) nonReentrant whenNotPaused returns (uint256 tokenId) {
        require(artist != address(0), "RoyaltyNFT: zero artist");
        require(bytes(tokenURI).length > 0, "RoyaltyNFT: empty uri");
        require(!_registeredHashes[songHash], "RoyaltyNFT: song exists");
        require(collaborators.length == sharesBps.length, "RoyaltyNFT: length mismatch");
        require(collaborators.length > 0, "RoyaltyNFT: no collaborators");

        uint256 total;
        for (uint256 i = 0; i < sharesBps.length; i++) {
            require(collaborators[i] != address(0), "RoyaltyNFT: zero recipient");
            total += sharesBps[i];
        }
        require(total == 10_000, "RoyaltyNFT: shares != 100%");

        tokenId = ++_nextTokenId;
        _safeMint(artist, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Deploy immutable splitter for this song
        IRoyaltySplitter splitter = IRoyaltySplitter(
            _deploySplitter(collaborators, sharesBps)
        );

        _songs[tokenId] = SongInfo({
            artist: artist,
            songHash: songHash,
            splitter: splitter,
            mintedAt: block.timestamp,
            totalStreams: 0
        });
        _registeredHashes[songHash] = true;
        _artistTokens[artist].push(tokenId);

        // Set ERC-2981 royalty to platform treasury with platformFeeBps
        _setTokenRoyalty(tokenId, platformTreasury, platformFeeBps);

        emit SongMinted(tokenId, artist, address(splitter), songHash, block.timestamp);
    }

    /// @inheritdoc IRoyaltyNFT
    function recordStreams(uint256 tokenId, uint256 streamCount)
        external
        override
        onlyRole(ORACLE_ROLE)
        whenNotPaused
    {
        require(_ownerOf(tokenId) != address(0), "RoyaltyNFT: unknown token");
        _songs[tokenId].totalStreams += streamCount;
        emit StreamsRecorded(tokenId, streamCount, _songs[tokenId].totalStreams, msg.sender);
    }

    /// @inheritdoc IRoyaltyNFT
    function getSongInfo(uint256 tokenId) external view override returns (SongInfo memory) {
        return _songs[tokenId];
    }

    /// @inheritdoc IRoyaltyNFT
    function getArtistTokens(address artist) external view override returns (uint256[] memory) {
        return _artistTokens[artist];
    }

    /// @inheritdoc IRoyaltyNFT
    function isSongRegistered(bytes32 songHash) external view override returns (bool) {
        return _registeredHashes[songHash];
    }

    function setPlatformFeeBps(uint96 newBps) external onlyOwner {
        require(newBps <= 1000, "RoyaltyNFT: fee too high");
        platformFeeBps = newBps;
        emit PlatformFeeUpdated(newBps);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        whenNotPaused
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal pure override(ERC721) {
        // disable batch mint gas optimization to keep code simple/auditable
        revert("RoyaltyNFT: disabled");
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @dev Deploys a minimal RoyaltySplitter proxy (cloned) for gas efficiency.
    /// @dev In production, use ERC-1167 clones. For clarity we deploy a new instance.
    function _deploySplitter(address[] memory recipients, uint256[] memory sharesBps)
        internal
        returns (address)
    {
        RoyaltySplitter splitter = new RoyaltySplitter(recipients, sharesBps, owner());
        return address(splitter);
    }
}
