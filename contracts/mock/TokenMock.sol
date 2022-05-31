//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Token {
    string public name = "My Token";
    string public symbol = "MT";

    address public owner;

    mapping(address => uint256) balances;

    uint256 public totalSupply = 10000001e18;

    uint8 public constant decimals = 18;

    constructor() {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        require(balances[from] >= amount, "Not enough tokens");

        balances[from] -= amount;
        balances[to] += amount;

        return true;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
