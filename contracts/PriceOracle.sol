// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PriceOracle {

    // This price oracle is pretty dumb. It just returns 0.5 ether
    // as the price.
    uint private constant _tokenPrice = 0.5 ether;

    function getLatestPrice() public pure returns (uint256) {
        return 0.5 ether;
    }
}
