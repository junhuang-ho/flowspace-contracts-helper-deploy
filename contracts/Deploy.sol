// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Deploy {
    mapping(address => bool) public isDeployed;

    function deploy() external {
        isDeployed[msg.sender] = true;
    }
}
