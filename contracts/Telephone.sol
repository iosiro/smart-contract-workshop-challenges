// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
  Execution context is important here. Under what conditions would the transaction
  origin (tx.origin) and msg.sender (caller of the function) not be the same? Can
  msg.sender change when interacting with smart contracts? Or contracts that call
  other contracts?
*/

contract Telephone {

  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}