// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRoyaltySplitter} from "./interfaces/IRoyaltySplitter.sol";

/// @title RoyaltySplitter
/// @notice Holds AVAX/native + ERC-20 royalties and pays recipients by immutable share
/// @dev Inspired by OpenZeppelin PaymentSplitter, simplified and gas-optimized for native + ERC-20.
///      Each song mints a fresh splitter so shares can never be tampered with.
contract RoyaltySplitter is IRoyaltySplitter {
    uint256 private constant _TOTAL_SHARES = 10_000;

    address[] private _payees;
    mapping(address payee => uint256 share) private _shares;
    mapping(address payee => uint256 released) private _released;
    uint256 private _totalReleased;

    address public immutable admin;

    event PayeeAdded(address account, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);

    constructor(address[] memory payees_, uint256[] memory shares_, address admin_) {
        require(payees_.length == shares_.length, "RoyaltySplitter: length mismatch");
        require(payees_.length > 0, "RoyaltySplitter: no payees");
        require(admin_ != address(0), "RoyaltySplitter: zero admin");

        uint256 total;
        address lastPayee;
        for (uint256 i = 0; i < payees_.length; i++) {
            require(payees_[i] != address(0), "RoyaltySplitter: zero payee");
            require(shares_[i] > 0, "RoyaltySplitter: zero share");
            require(payees_[i] > lastPayee, "RoyaltySplitter: unsorted payees");
            lastPayee = payees_[i];
            _payees.push(payees_[i]);
            _shares[payees_[i]] = shares_[i];
            total += shares_[i];
        }
        require(total == _TOTAL_SHARES, "RoyaltySplitter: shares != 100%");
        admin = admin_;
    }

    receive() external payable virtual {
        emit PaymentReceived(msg.sender, msg.value);
    }

    /// @inheritdoc IRoyaltySplitter
    function release(address payable account) public override {
        require(_shares[account] > 0, "RoyaltySplitter: no share");

        uint256 totalReceived = address(this).balance + _totalReleased;
        uint256 payment = (totalReceived * _shares[account]) / _TOTAL_SHARES - _released[account];

        require(payment > 0, "RoyaltySplitter: nothing to release");

        _released[account] += payment;
        _totalReleased += payment;

        Address.sendValue(account, payment);
        emit PaymentReleased(account, payment);
    }

    /// @inheritdoc IRoyaltySplitter
    function pendingRelease(address account) public view override returns (uint256) {
        uint256 totalReceived = address(this).balance + _totalReleased;
        return (totalReceived * _shares[account]) / _TOTAL_SHARES - _released[account];
    }

    /// @inheritdoc IRoyaltySplitter
    function payeeCount() external view override returns (uint256) {
        return _payees.length;
    }

    /// @inheritdoc IRoyaltySplitter
    function payee(uint256 index) external view override returns (address) {
        return _payees[index];
    }

    /// @inheritdoc IRoyaltySplitter
    function shares(address account) external view override returns (uint256) {
        return _shares[account];
    }

    /// @inheritdoc IRoyaltySplitter
    function released(address account) external view override returns (uint256) {
        return _released[account];
    }

    /// @inheritdoc IRoyaltySplitter
    function releaseAll() external override {
        for (uint256 i = 0; i < _payees.length; i++) {
            release(payable(_payees[i]));
        }
    }
}

/// @dev Minimal Address helper (avoids importing OZ Address.sol for one fn)
library Address {
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient");
        (bool success,) = recipient.call{value: amount}("");
        require(success, "Address: send failed");
    }
}
