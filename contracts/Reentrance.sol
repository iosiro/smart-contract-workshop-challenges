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

  function donate(address _to) public payable {
    balances[_to] = balances[_to] + msg.value;
  }

  function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
  }

  function withdraw(uint _amount) public {
    if(balances[msg.sender] >= _amount) {
      (bool result,) = msg.sender.call{value:_amount}("");
      if(result) {
        _amount;
      }
      // we've already checked that balances[msg.sender] >= amount,
      // so literally no way there's an underflow. we might as well
      // use unchecked to disable the builtin arithmetic overflow
      // protection and save gas.
      unchecked {
        balances[msg.sender] -= _amount;
      }
    }
  }

  receive() external payable {}
}