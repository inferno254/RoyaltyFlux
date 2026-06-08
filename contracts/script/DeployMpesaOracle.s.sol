// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MpesaOracle} from "../src/MpesaOracle.sol";

contract DeployMpesaOracle is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address priceFeed = vm.envAddress("KES_USD_FEED");
        address updater = vm.envOr("ORACLE_UPDATER", vm.addr(pk));

        vm.startBroadcast(pk);
        MpesaOracle oracle = new MpesaOracle(vm.addr(pk), priceFeed, updater);
        console2.log("MpesaOracle deployed at:", address(oracle));
        vm.stopBroadcast();
    }
}
