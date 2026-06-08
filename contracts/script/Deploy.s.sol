// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {RoyaltyNFT} from "../src/RoyaltyNFT.sol";
import {PlatformTreasury} from "../src/PlatformTreasury.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        uint96 platformFeeBps = uint96(vm.envOr("ROYALTY_FEE_BPS", uint256(250)));

        vm.startBroadcast(pk);
        address deployer = vm.addr(pk);

        PlatformTreasury treasury = new PlatformTreasury(deployer, deployer);
        RoyaltyNFT nft = new RoyaltyNFT(deployer, address(treasury), platformFeeBps);

        // Grant MINTER_ROLE to a backend signer (set via env or default to deployer)
        address backendSigner = vm.envOr("BACKEND_SIGNER", deployer);
        if (backendSigner != deployer) {
            nft.grantRole(nft.MINTER_ROLE(), backendSigner);
            nft.grantRole(nft.ORACLE_ROLE(), backendSigner);
        }

        console2.log("RoyaltyNFT deployed at:", address(nft));
        console2.log("PlatformTreasury deployed at:", address(treasury));
        console2.log("Deployer:", deployer);
        console2.log("Platform fee (bps):", platformFeeBps);

        vm.stopBroadcast();
    }
}
