//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FundNFT is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 internal tokenId;

    mapping(uint256 => uint256) public shareMap;
    uint256 public totalShare;
    mapping(uint256 => uint256) public valueMap;
    uint256 public totalValue;

    event Mint(
        address indexed provider,
        uint256 tokenId,
        uint256 share,
        uint256 value,
        uint256 ts
    );

    event Merge(
        uint256 indexed from,
        uint256 indexed to,
        uint256 share,
        uint256 value,
        uint256 ts
    );

    constructor(address _safe) ERC721("MST FUND NFT", "MSTFUNDNFT") {
        _setupRole(DEFAULT_ADMIN_ROLE, _safe);
    }

    function mint(
        address provider,
        uint256 share,
        uint256 value
    ) public onlyRole(MINTER_ROLE) {
        ++tokenId;
        _mint(provider, tokenId);

        shareMap[tokenId] = share;
        totalShare += share;
        valueMap[tokenId] = value;
        totalValue += value;

        emit Mint(provider, tokenId, share, value, block.timestamp);
    }

    function merge(uint256 _from, uint256 _to) external {
        require(_from != _to);
        require(_isApprovedOrOwner(msg.sender, _from));
        require(_isApprovedOrOwner(msg.sender, _to));

        uint256 share0 = shareMap[_from];
        uint256 share1 = shareMap[_to];
        shareMap[_to] = share0 + share1;
        shareMap[_from] = 0;

        uint256 value0 = valueMap[_from];
        uint256 value1 = valueMap[_to];
        valueMap[_to] = value0 + value1;
        valueMap[_from] = 0;

        _burn(_from);

        emit Merge(_from, _to, share0, value0, block.timestamp);
    }

    function burn(uint256 _tokenId) external {
        require(_isApprovedOrOwner(msg.sender, _tokenId));
        _burn(_tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
