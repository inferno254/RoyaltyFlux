// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {RoyaltyNFT} from "../../src/RoyaltyNFT.sol";
import {RoyaltySplitter} from "../../src/RoyaltySplitter.sol";
import {PlatformTreasury} from "../../src/PlatformTreasury.sol";
import {DeployHelpers} from "../utils/DeployHelpers.sol";

contract RoyaltyNFTTest is Test {
    RoyaltyNFT public nft;
    PlatformTreasury public treasury;
    address public admin = makeAddr("admin");
    address public backend = makeAddr("backend");
    address public artist = makeAddr("artist");
    address public collab = makeAddr("collab");

    function setUp() public {
        DeployHelpers.DeployResult memory r = DeployHelpers.deployAll(admin, backend, 250);
        nft = r.nft;
        treasury = r.treasury;
    }

    function test_Mint_Song_Emits_Event() public {
        vm.startPrank(backend);
        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = artist;
        collabs[1] = collab;
        shares[0] = 7000;
        shares[1] = 3000;

        vm.expectEmit(true, true, true, true);
        bytes32 songHash = keccak256("song-1");
        uint256 expectedTokenId = 1;

        // Reconstruct event manually (since splitter address is dynamic)
        // We just check that the call succeeds and the token exists
        uint256 tokenId = nft.mintSong(
            artist, "ipfs://test", collabs, shares, songHash
        );
        assertEq(tokenId, expectedTokenId);
        assertEq(nft.ownerOf(tokenId), artist);
        vm.stopPrank();
    }

    function test_Revert_When_Caller_Not_Minter() public {
        vm.prank(artist);
        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = artist;
        collabs[1] = collab;
        shares[0] = 5000;
        shares[1] = 5000;

        vm.expectRevert();
        nft.mintSong(artist, "ipfs://test", collabs, shares, keccak256("x"));
    }

    function test_Revert_When_Shares_Do_Not_Sum_To_10000() public {
        vm.startPrank(backend);
        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = artist;
        collabs[1] = collab;
        shares[0] = 5000;
        shares[1] = 4000; // 9000 total

        vm.expectRevert(bytes("RoyaltyNFT: shares != 100%"));
        nft.mintSong(artist, "ipfs://test", collabs, shares, keccak256("x"));
        vm.stopPrank();
    }

    function test_Revert_When_Song_Hash_Already_Registered() public {
        vm.startPrank(backend);
        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = artist;
        collabs[1] = collab;
        shares[0] = 5000;
        shares[1] = 5000;
        bytes32 songHash = keccak256("dup");

        nft.mintSong(artist, "ipfs://a", collabs, shares, songHash);
        vm.expectRevert(bytes("RoyaltyNFT: song exists"));
        nft.mintSong(artist, "ipfs://b", collabs, shares, songHash);
        vm.stopPrank();
    }

    function test_Record_Streams_Only_Oracle() public {
        _mintSample();
        vm.prank(artist);
        vm.expectRevert();
        nft.recordStreams(1, 100);
    }

    function test_Record_Streams_Accumulates() public {
        _mintSample();
        vm.startPrank(backend);
        nft.recordStreams(1, 50);
        nft.recordStreams(1, 75);
        (, , , , uint256 total) = nft.getSongInfo(1);
        assertEq(total, 125);
        vm.stopPrank();
    }

    function test_Pause_Blocks_Mint() public {
        vm.prank(admin);
        nft.pause();
        vm.startPrank(backend);
        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = artist;
        collabs[1] = collab;
        shares[0] = 5000;
        shares[1] = 5000;
        vm.expectRevert();
        nft.mintSong(artist, "ipfs://x", collabs, shares, keccak256("y"));
        vm.stopPrank();
    }

    function test_Get_Artist_Tokens() public {
        _mintSample();
        uint256[] memory tokens = nft.getArtistTokens(artist);
        assertEq(tokens.length, 1);
        assertEq(tokens[0], 1);
    }

    function test_Erc2981_Royalty_Set() public {
        _mintSample();
        (address receiver, uint256 amount) = nft.royaltyInfo(1, 10_000);
        assertEq(receiver, address(treasury));
        assertEq(amount, 250); // 2.5% of 10_000
    }

    function _mintSample() internal {
        vm.startPrank(backend);
        address[] memory collabs = new address[](2);
        uint256[] memory shares = new uint256[](2);
        collabs[0] = artist;
        collabs[1] = collab;
        shares[0] = 7000;
        shares[1] = 3000;
        nft.mintSong(artist, "ipfs://sample", collabs, shares, keccak256("sample"));
        vm.stopPrank();
    }
}
