// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMpesaOracle {
    event RateUpdated(uint256 rate, bool manual, uint256 timestamp);
    event TierRateUpdated(uint8 tier, uint256 rateKes);

    function getKesUsdRate() external view returns (uint256 rate, bool isStale);
    function computePayout(uint8 tier, uint256 streamCount) external view returns (uint256);
    function tierRate(uint8 tier) external view returns (uint256);
    function manualRate() external view returns (uint256);
}
