// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Walkthrough {

    address public lastCaller;

    function callMe() public {
        lastCaller = msg.sender;
    }

}