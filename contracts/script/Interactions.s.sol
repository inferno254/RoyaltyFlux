// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {RoyaltyNFT} from "../src/RoyaltyNFT.sol";

contract Interactions is Script {
    function mint() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address nftAddr = vm.envAddress("ROYALTY_NFT_ADDRESS");
        RoyaltyNFT nft = RoyaltyNFT(nftAddr);

        address artist = vm.envAddress("ARTIST_ADDRESS");
        string memory uri = vm.envString("TOKEN_URI");
        bytes32 songHash = keccak256(abi.encodePacked(uri));
        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = artist;
        collabs[1] = vm.envAddress("COLLAB_ADDRESS");
        shares[0] = 7000;
        shares[1] = 3000;

        vm.startBroadcast(pk);
        uint256 tokenId = nft.mintSong(artist, uri, collabs, shares, songHash);
        console2.log("Minted tokenId:", tokenId);
        vm.stopBroadcast();
    }

    function recordStreams() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address nftAddr = vm.envAddress("ROYALTY_NFT_ADDRESS");
        uint256 tokenId = vm.envUint("TOKEN_ID");
        uint256 count = vm.envUint("STREAM_COUNT");
        RoyaltyNFT nft = RoyaltyNFT(nftAddr);

        vm.startBroadcast(pk);
        nft.recordStreams(tokenId, count);
        vm.stopBroadcast();
    }
}
