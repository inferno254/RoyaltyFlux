// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRoyaltySplitter {
    event PayeeAdded(address account, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);

    function release(address payable account) external;
    function releaseAll() external;
    function pendingRelease(address account) external view returns (uint256);
    function payeeCount() external view returns (uint256);
    function payee(uint256 index) external view returns (address);
    function shares(address account) external view returns (uint256);
    function released(address account) external view returns (uint256);
    function admin() external view returns (address);
}
