// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {RoyaltyNFT} from "../src/RoyaltyNFT.sol";

/// @notice Mint a few sample songs for local testing
contract SeedData is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address nftAddr = vm.envAddress("ROYALTY_NFT_ADDRESS");
        RoyaltyNFT nft = RoyaltyNFT(nftAddr);

        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = vm.envOr("ARTIST1", vm.addr(pk));
        collabs[1] = vm.envOr("ARTIST2", vm.addr(pk));
        shares[0] = 6000;
        shares[1] = 4000;

        vm.startBroadcast(pk);
        nft.mintSong(
            collabs[0],
            "ipfs://QmSampleSong1/metadata.json",
            collabs,
            shares,
            keccak256("sample-song-1")
        );
        nft.mintSong(
            collabs[1],
            "ipfs://QmSampleSong2/metadata.json",
            collabs,
            shares,
            keccak256("sample-song-2")
        );
        console2.log("Seeded 2 sample songs");
        vm.stopBroadcast();
    }
}
