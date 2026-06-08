// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {IMpesaOracle} from "./interfaces/IMpesaOracle.sol";

/// @title MpesaOracle
/// @notice Provides KES/USD rate to the backend for off-chain M-Pesa STK Push
/// @dev Combines a Chainlink price feed (manual or official) with a custodian-updatable fallback.
///      The backend reads latestAnswer() to compute payout amount in KES for a given stream count.
contract MpesaOracle is IMpesaOracle, Ownable, AccessControl, Pausable {
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    AggregatorV3Interface public immutable priceFeed; // KES/USD (or USD/KES)
    uint256 public manualRate; // 1e8 scaled (Chainlink convention) — used if priceFeed stale
    bool public useManualRate;
    uint256 public constant STALE_AFTER = 24 hours;
    uint256 public lastUpdate;

    // Per-stream payout rates (in KES, 1e18 scaled) by tier
    mapping(uint8 tier => uint256 rateKes) public tierRate;

    event RateUpdated(uint256 rate, bool manual, uint256 timestamp);
    event TierRateUpdated(uint8 tier, uint256 rateKes);

    constructor(address admin_, address priceFeed_, address updater_) Ownable(admin_) {
        require(priceFeed_ != address(0), "MpesaOracle: zero feed");
        priceFeed = AggregatorV3Interface(priceFeed_);
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(UPDATER_ROLE, updater_);

        // Default tier rates (KES per stream, 1e18)
        tierRate[0] = 0.05 ether; // free tier: 0.05 KES
        tierRate[1] = 0.10 ether; // standard
        tierRate[2] = 0.25 ether; // premium
        tierRate[3] = 0.50 ether; // exclusive
    }

    /// @notice Get current KES/USD rate (1 USD = X KES, 1e8 scaled)
    function getKesUsdRate() external view override returns (uint256 rate, bool isStale) {
        if (useManualRate) {
            return (manualRate, block.timestamp > lastUpdate + STALE_AFTER);
        }
        (, int256 answer,, uint256 updatedAt,) = priceFeed.latestRoundData();
        if (updatedAt == 0 || block.timestamp > updatedAt + STALE_AFTER) {
            return (manualRate, true);
        }
        return (uint256(answer), false);
    }

    /// @notice Compute KES payout for `streamCount` streams at `tier`
    function computePayout(uint8 tier, uint256 streamCount) external view override returns (uint256) {
        require(streamCount > 0, "MpesaOracle: zero streams");
        return tierRate[tier] * streamCount;
    }

    function setTierRate(uint8 tier, uint256 rateKes) external onlyRole(UPDATER_ROLE) {
        tierRate[tier] = rateKes;
        emit TierRateUpdated(tier, rateKes);
    }

    function setManualRate(uint256 rate) external onlyRole(UPDATER_ROLE) {
        manualRate = rate;
        useManualRate = true;
        lastUpdate = block.timestamp;
        emit RateUpdated(rate, true, block.timestamp);
    }

    function enableChainlinkFeed() external onlyRole(UPDATER_ROLE) {
        useManualRate = false;
        emit RateUpdated(0, false, block.timestamp);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
