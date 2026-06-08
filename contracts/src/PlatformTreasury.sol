// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title PlatformTreasury
/// @notice Holds platform fees collected from NFT mints and royalties
contract PlatformTreasury is Ownable, Pausable, ReentrancyGuard {
    event Withdraw(address indexed to, uint256 amount);
    event Deposit(address indexed from, uint256 amount);

    address public feeCollector;
    uint256 public totalCollected;

    constructor(address admin_, address feeCollector_) Ownable(admin_) {
        require(feeCollector_ != address(0), "Treasury: zero collector");
        feeCollector = feeCollector_;
    }

    receive() external payable {
        totalCollected += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount, address to) external onlyOwner nonReentrant {
        require(to != address(0), "Treasury: zero to");
        require(amount <= address(this).balance, "Treasury: insufficient");
        (bool success,) = to.call{value: amount}("");
        require(success, "Treasury: send failed");
        emit Withdraw(to, amount);
    }

    function withdrawAll(address to) external onlyOwner nonReentrant {
        uint256 bal = address(this).balance;
        (bool success,) = to.call{value: bal}("");
        require(success, "Treasury: send failed");
        emit Withdraw(to, bal);
    }

    function setFeeCollector(address collector) external onlyOwner {
        require(collector != address(0), "Treasury: zero collector");
        feeCollector = collector;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
