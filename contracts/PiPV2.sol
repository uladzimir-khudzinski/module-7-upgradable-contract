// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./PiPV1.sol";

contract PiPV2 is PiPV1 {
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function version() public pure returns (string memory) {
        return "V2";
    }

    function airdrop(address to) public {
        require(to != address(0), "Cannot airdrop to zero address");
        _mint(to, 1 * 10**decimals());
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
