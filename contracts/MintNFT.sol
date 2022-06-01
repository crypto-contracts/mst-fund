//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IFundNFT {
    function mint(
        address,
        uint256,
        uint256
    ) external;
}

interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function decimals() external returns (uint8);
}

contract MintNFT {
    address public immutable safe;
    address public immutable token;
    address public immutable fundNFT;
    uint256 public immutable base;

    constructor(
        address _safe,
        address _token,
        address _fundNFT,
        uint256 _base
    ) {
        safe = _safe;
        token = _token;
        fundNFT = _fundNFT;
        base = _base;
    }

    function deposit(uint256 value) external {
        uint256 decimals = uint256(IERC20(token).decimals());

        require(
            value % (base * (10**decimals)) == 0 && value > 0,
            "value is not correct"
        );

        require(IERC20(token).transferFrom(msg.sender, safe, value));

        uint256 share = value / (base * (10**decimals));
        IFundNFT(fundNFT).mint(msg.sender, share, value);
    }
}
