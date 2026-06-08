// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {RoyaltySplitter} from "../../src/RoyaltySplitter.sol";

contract RoyaltySplitterTest is Test {
    RoyaltySplitter public splitter;
    address public admin = makeAddr("admin");
    address public a = makeAddr("a");
    address public b = makeAddr("b");
    address public c = makeAddr("c");

    function setUp() public {
        // Payees must be sorted ascending
        address[] memory payees = new address[](3);
        uint256[] memory shares = new uint256[](3);
        payees[0] = a;
        payees[1] = b;
        payees[2] = c;
        shares[0] = 5000;
        shares[1] = 3000;
        shares[2] = 2000;
        splitter = new RoyaltySplitter(payees, shares, admin);
    }

    function test_Distribute_70_30() public {
        address[] memory payees = new address[](2);
        uint256[] memory shares = new uint256[](2);
        payees[0] = a;
        payees[1] = b;
        shares[0] = 7000;
        shares[1] = 3000;
        RoyaltySplitter s = new RoyaltySplitter(payees, shares, admin);

        vm.deal(address(s), 10 ether);
        s.release(payable(a));
        s.release(payable(b));

        assertEq(a.balance, 7 ether);
        assertEq(b.balance, 3 ether);
        assertEq(address(s).balance, 0);
    }

    function test_PendingRelease_Calculates_Correctly() public {
        vm.deal(address(splitter), 1 ether);
        assertEq(splitter.pendingRelease(a), 0.5 ether);
        assertEq(splitter.pendingRelease(b), 0.3 ether);
        assertEq(splitter.pendingRelease(c), 0.2 ether);
    }

    function test_Revert_On_Unsorted_Payees() public {
        address[] memory payees = new address[](2);
        uint256[] memory shares = new uint256[](2);
        payees[0] = b;
        payees[1] = a; // unsorted
        shares[0] = 5000;
        shares[1] = 5000;
        vm.expectRevert(bytes("RoyaltySplitter: unsorted payees"));
        new RoyaltySplitter(payees, shares, admin);
    }

    function test_Revert_On_Length_Mismatch() public {
        address[] memory payees = new address[](2);
        uint256[] memory shares = new uint256[](1);
        payees[0] = a;
        payees[1] = b;
        shares[0] = 10_000;
        vm.expectRevert(bytes("RoyaltySplitter: length mismatch"));
        new RoyaltySplitter(payees, shares, admin);
    }

    function test_Revert_On_Shares_Not_100() public {
        address[] memory payees = new address[](2);
        uint256[] memory shares = new uint256[](2);
        payees[0] = a;
        payees[1] = b;
        shares[0] = 5000;
        shares[1] = 4000;
        vm.expectRevert(bytes("RoyaltySplitter: shares != 100%"));
        new RoyaltySplitter(payees, shares, admin);
    }

    function test_Revert_On_Nothing_To_Release() public {
        vm.prank(a);
        vm.expectRevert(bytes("RoyaltySplitter: nothing to release"));
        splitter.release(payable(a));
    }

    function test_Release_Only_Once_For_Partial_Withdrawals() public {
        address[] memory payees = new address[](2);
        uint256[] memory shares = new uint256[](2);
        payees[0] = a;
        payees[1] = b;
        shares[0] = 5000;
        shares[1] = 5000;
        RoyaltySplitter s = new RoyaltySplitter(payees, shares, admin);

        vm.deal(address(s), 4 ether);
        s.release(payable(a));
        assertEq(a.balance, 2 ether);
        assertEq(s.pendingRelease(a), 0);

        vm.deal(address(s), 4 ether);
        s.release(payable(a));
        assertEq(a.balance, 4 ether);
    }
}
