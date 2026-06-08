// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PaymentSplitterLib {
    uint256 internal constant TOTAL_SHARES = 10_000;

    error LengthMismatch();
    error NoPayees();
    error ZeroPayee();
    error ZeroShare();
    error UnsortedPayees();
    error SharesNotHundred();
    error NothingToRelease();

    function validatePayees(address[] memory payees, uint256[] memory shares) internal pure {
        if (payees.length != shares.length) revert LengthMismatch();
        if (payees.length == 0) revert NoPayees();

        uint256 total;
        address lastPayee;
        for (uint256 i = 0; i < payees.length; i++) {
            if (payees[i] == address(0)) revert ZeroPayee();
            if (shares[i] == 0) revert ZeroShare();
            if (payees[i] <= lastPayee) revert UnsortedPayees();
            lastPayee = payees[i];
            total += shares[i];
        }
        if (total != TOTAL_SHARES) revert SharesNotHundred();
    }

    function computeShare(uint256 totalReceived, uint256 share, uint256 released)
        internal
        pure
        returns (uint256)
    {
        uint256 owed = (totalReceived * share) / TOTAL_SHARES;
        if (owed <= released) revert NothingToRelease();
        return owed - released;
    }
}
