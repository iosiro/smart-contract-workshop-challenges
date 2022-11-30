// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
  Sometimes contracts don't account for callers "re-entering"
  the contract halfway through the execution of an existing function.
  It's not really something a caller can force. But, for example,
  msg.sender.call will call the receive() function of msg.sender if
  msg.sender is a contract.
*/

contract Reentrance {
    mapping(address => uint) public balances;

  function deposit() public payable {
    balances[msg.sender] = balances[msg.sender] + msg.value;
  }

  function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
  }

  function withdraw() public {
    uint balance = balances[msg.sender];

    if(balance > 0) {
      (bool success,) = msg.sender.call{value: balance}("");

      require(success, "transfer failed");

      balances[msg.sender] = 0;
    }
  }

  receive() external payable {
    deposit();
  }
}