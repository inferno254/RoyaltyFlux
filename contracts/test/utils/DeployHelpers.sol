// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {RoyaltyNFT} from "../../src/RoyaltyNFT.sol";
import {PlatformTreasury} from "../../src/PlatformTreasury.sol";

library DeployHelpers {
    struct DeployResult {
        RoyaltyNFT nft;
        PlatformTreasury treasury;
    }

    function deployAll(address admin, address backend, uint96 feeBps)
        internal
        returns (DeployResult memory r)
    {
        r.treasury = new PlatformTreasury(admin, admin);
        r.nft = new RoyaltyNFT(admin, address(r.treasury), feeBps);
        r.nft.grantRole(r.nft.MINTER_ROLE(), backend);
        r.nft.grantRole(r.nft.ORACLE_ROLE(), backend);
    }
}
