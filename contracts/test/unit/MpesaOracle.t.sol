// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MpesaOracle} from "../../src/MpesaOracle.sol";
import {MockChainlinkFeed} from "../mocks/MockChainlinkFeed.sol";

contract MpesaOracleTest is Test {
    MpesaOracle public oracle;
    MockChainlinkFeed public feed;
    address public admin = makeAddr("admin");
    address public updater = makeAddr("updater");

    function setUp() public {
        feed = new MockChainlinkFeed();
        feed.setLatestAnswer(130_000_000); // 130 KES per USD (1e8 scaled)
        feed.setUpdatedAt(block.timestamp);
        oracle = new MpesaOracle(admin, address(feed), updater);
    }

    function test_GetRate_From_Chainlink() public view {
        (uint256 rate, bool stale) = oracle.getKesUsdRate();
        assertEq(rate, 130_000_000);
        assertEq(stale, false);
    }

    function test_Stale_Falls_Back_To_Manual() public {
        vm.prank(updater);
        oracle.setManualRate(125_000_000);

        feed.setUpdatedAt(block.timestamp - 25 hours);

        (uint256 rate, bool stale) = oracle.getKesUsdRate();
        assertEq(rate, 125_000_000);
        assertEq(stale, true);
    }

    function test_Manual_Rate_Override() public {
        vm.prank(updater);
        oracle.setManualRate(140_000_000);
        (uint256 rate,) = oracle.getKesUsdRate();
        assertEq(rate, 140_000_000);
    }

    function test_ComputePayout_Tier0() public view {
        uint256 amount = oracle.computePayout(0, 1000);
        assertEq(amount, 0.05 ether * 1000); // 50 KES (1e18)
    }

    function test_ComputePayout_Tier3() public view {
        uint256 amount = oracle.computePayout(3, 100);
        assertEq(amount, 0.50 ether * 100);
    }

    function test_SetTierRate_Only_Updater() public {
        vm.prank(address(0xBEEF));
        vm.expectRevert();
        oracle.setTierRate(0, 1 ether);
    }

    function test_Pause_Blocks_Setters() public {
        vm.prank(admin);
        oracle.pause();
        vm.prank(updater);
        vm.expectRevert();
        oracle.setManualRate(100_000_000);
    }
}
