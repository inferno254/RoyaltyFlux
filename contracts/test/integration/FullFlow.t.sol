// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {RoyaltyNFT} from "../../src/RoyaltyNFT.sol";
import {RoyaltySplitter} from "../../src/RoyaltySplitter.sol";
import {PlatformTreasury} from "../../src/PlatformTreasury.sol";
import {DeployHelpers} from "../utils/DeployHelpers.sol";

contract FullFlowTest is Test {
    RoyaltyNFT public nft;
    PlatformTreasury public treasury;
    address public admin = makeAddr("admin");
    address public backend = makeAddr("backend");
    address public artist = makeAddr("artist");
    address public producer = makeAddr("producer");

    function setUp() public {
        DeployHelpers.DeployResult memory r = DeployHelpers.deployAll(admin, backend, 250);
        nft = r.nft;
        treasury = r.treasury;
    }

    function test_Mint_Then_Record_Streams_Then_Withdraw() public {
        // 1. Mint
        vm.startPrank(backend);
        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = artist;
        collabs[1] = producer;
        shares[0] = 7000;
        shares[1] = 3000;
        uint256 tokenId = nft.mintSong(
            artist, "ipfs://hit", collabs, shares, keccak256("hit")
        );
        vm.stopPrank();

        // 2. Record streams
        vm.prank(backend);
        nft.recordStreams(tokenId, 1000);

        (,,,, uint256 total) = nft.getSongInfo(tokenId);
        assertEq(total, 1000);

        // 3. Splitter exists and has admin role
        address splitterAddr;
        (, , splitterAddr,,) = nft.getSongInfo(tokenId);
        RoyaltySplitter splitter = RoyaltySplitter(splitterAddr);
        assertEq(splitter.admin(), admin);

        // 4. Anyone can fund splitter, artist/producer can withdraw
        vm.deal(splitterAddr, 10 ether);
        splitter.release(payable(artist));
        splitter.release(payable(producer));
        assertEq(artist.balance, 7 ether);
        assertEq(producer.balance, 3 ether);
    }
}
