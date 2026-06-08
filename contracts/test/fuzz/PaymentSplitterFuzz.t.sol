// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {RoyaltySplitter} from "../../src/RoyaltySplitter.sol";
import {PaymentSplitterLib} from "../../src/libraries/PaymentSplitterLib.sol";

contract PaymentSplitterFuzzTest is Test {
    using PaymentSplitterLib for *;

    function testFuzz_DistributeExact(uint128 a, uint128 b, uint128 c) public {
        // Constrain shares to sum to 10_000
        uint256 sum = uint256(a) + uint256(b) + uint256(c);
        if (sum == 0) return;
        vm.assume(sum <= 10_000);
        a = uint128(uint256(a) * 10_000 / sum);
        b = uint128(uint256(b) * 10_000 / sum);
        c = 0;
        uint256 newSum = uint256(a) + uint256(b) + uint256(c);
        if (newSum < 10_000) c = uint128(10_000 - newSum);

        address[] memory payees = new address[](3);
        uint256[] memory shares = new uint256[](3);
        payees[0] = address(0x1);
        payees[1] = address(0x2);
        payees[2] = address(0x3);
        shares[0] = a;
        shares[1] = b;
        shares[2] = c;

        RoyaltySplitter splitter = new RoyaltySplitter(payees, shares, address(this));
        uint256 total = 10 ether;
        vm.deal(address(splitter), total);

        splitter.release(payable(address(0x1)));
        splitter.release(payable(address(0x2)));
        splitter.release(payable(address(0x3)));

        uint256 distributed = address(0x1).balance + address(0x2).balance + address(0x3).balance;
        // Allow 1 wei rounding error per payee
        assertLe(total - distributed, 3);
    }
}
