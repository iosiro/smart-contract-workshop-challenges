//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/*
    This is an example contract to demonstrate some basic solidity
    syntax. It shows creating/using access modifiers, transferring eth,
    accepting eth, making external calls, etc.
*/

interface IPriceOracle {
    function getLatestPrice() external view returns (uint256);
}

contract SolidityIntro {
    //  Privileged users of the contract
    address public owner;
    address public minter;

    //  A mapping to store the balance of any user 
    mapping(address => uint) public balances;
    
    // The total supply of tokens that have been minted
    uint public totalSupply;

    // The price oracle contract which we want to call from this contract
    IPriceOracle _priceOracle;

    //  The constructor is only executed when the contract is deployed.
    //  A contract does not have to be written with a constructor, which
    //  will simply imply an empty constructor.
    constructor(address _minter, address priceOracle) {
        minter = _minter;
        // msg.sender is built-in, and can be used to retrieve the address of the
        // function caller. In the constructor, this will be the contract creator.
        owner = msg.sender;

        // we can cast an address to a contract!
        _priceOracle = IPriceOracle(priceOracle);
    }

    //  modifiers provide a convenient way to write reusable "checks" that should
    //  be performed prior to executing a function. This is commonly used for access
    //  control, such as ensuring that only the minter can call the mint and burn
    //  functions.
    //  Functions can have multiple modifiers, and a few built-in modifiers exist.
    //      external - can only be accessed externally
    //      public   - can be accessed externally and from the contract itself
    //      private  - can only be accessed by the contract itself
    //      internal - can only be accessed by the contract itself and child contracts
    //                  (contract inheriting from this contract)
    modifier onlyMinter() {
        // require is the de facto assert in solidity, and accepts a statement
        // that needs to be true and a "failure" message as arguments. If the
        // assertion fails, the transaction will revert and all state changes
        // are rolled back.
        require(msg.sender == minter, "Only the minter can call this function");
        _;
    }

    function mint(address account, uint amount) public onlyMinter {
        _mint(account, amount);
    }

    function _mint(address account, uint amount) private {
        totalSupply += amount;
        balances[account] += amount;
    }

    function burn(address account, uint amount) public onlyMinter {
        _burn(account, amount);
    }

    function _burn(address account, uint amount) private {
        require(balances[account] >= amount, "Insufficient balance to burn");
        totalSupply -= amount;
        balances[account] -= amount;
    }

    // 04 - Two additional built-in modifiers to be aware of are
    //  view - indicates that the function will not change the state of the contract, and
    //         only reads. Reading public state variables of a contract is treated the same
    //         as calling a view function.
    //  pure - indicates that the function does not read from the, or write to the state of
    //         the contract
    function balanceOf(address account) public view returns (uint) {
        return balances[account];
    }

    function priceOf(uint amount) public view returns (uint) {
        // and this is how we would make an external call to another contract
        // from our contract
        return _priceOracle.getLatestPrice() * amount;
    }

    // 05 - A function can be made "payable" to indicate that ether can be attached to the
    //      transaction when calling this function. payable functions are used when a user
    //      needs to "pay" ether in order to perform a task. This is not the same as gas fees.
    function buyTokens(uint amount) public payable returns (uint) {
        uint _price = priceOf(amount);

        // msg.value will contain the amount of ether, expressed in wei, attached to the tx
        require(msg.value == _price, "Incorrect amount of eth supplied for the purchase");

        _mint(msg.sender, amount);
        return amount;
    }

    function sellTokens(uint amount) public returns (uint) {
        uint _price = priceOf(amount);

        _burn(msg.sender, amount);
        
        // There are multiple ways a contract can send ether to other
        // contracts. In this example, we are "calling" the address, specifying
        // an eth value to attach to it, but with empty call data. This works
        // for contracts that implement the receive() function, or externally-owned
        // accounts (human beans with private keys)
        (bool success,) = payable(msg.sender).call{value: _price}("");
        require(success, "transfer failed");

        return amount;
    }

    fallback() external payable {}
    receive() external payable {}

}