// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ValidAddressLib {
    error ZeroAddress();

    function requireNotZero(address addr) internal pure {
        if (addr == address(0)) revert ZeroAddress();
    }
}
