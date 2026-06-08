// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRoyaltyNFT {
    struct SongInfo {
        address artist;
        bytes32 songHash;
        address splitter;
        uint256 mintedAt;
        uint256 totalStreams;
    }

    event SongMinted(
        uint256 indexed tokenId,
        address indexed artist,
        address indexed splitter,
        bytes32 songHash,
        uint256 timestamp
    );
    event StreamsRecorded(
        uint256 indexed tokenId, uint256 streamCount, uint256 totalStreams, address indexed oracle
    );
    event PlatformFeeUpdated(uint96 newFeeBps);

    function mintSong(
        address artist,
        string calldata tokenURI,
        address[] calldata collaborators,
        uint256[] calldata sharesBps,
        bytes32 songHash
    ) external returns (uint256 tokenId);

    function recordStreams(uint256 tokenId, uint256 streamCount) external;

    function getSongInfo(uint256 tokenId) external view returns (SongInfo memory);

    function getArtistTokens(address artist) external view returns (uint256[] memory);

    function isSongRegistered(bytes32 songHash) external view returns (bool);

    function platformFeeBps() external view returns (uint96);

    function platformTreasury() external view returns (address);
}
