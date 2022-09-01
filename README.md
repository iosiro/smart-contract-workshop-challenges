# Install Dependencies

For the best experience, `NodeJS v16` is recommended (https://nodejs.org/en/download/). But with `NodeJS` and `npm` installed, simply run `npm install` from the project root to get set up.

To ensure your setup works as intended, run `npx hardhat test test/JavascriptExampleCode.js` from the project root.

# Solidity/Javascript Example Code

The `SolidityIntro` contract (`contracts/SolidityIntro.sol`) and `JavascriptExampleCode.js` script (`test/JavascriptExampleCode.js`) provide some example syntax to get you started. `SolidityIntro.sol` demonstrates some basic language concepts, and `JavascriptExampleCode.js` shows how to deploy and interact with smart contracts using HardHat's `ethers` module. It should be sufficient to get you going. Additionally, this README also includes some Solidity and Javascript (hardhat) gotcha's!

# Challenges

The challenge contracts can all be found in the `contracts` directory. Try them from easiest to hardest, in the following order:

* `Telephone.sol`: How could `msg.sender` potentially change over the course of a transaction?
* `CoinFlip.sol`: A game of chance on the inherently deterministic blockchain. Smart.
* `Reentrancy.sol`: Perhaps one of the most common classes of vulnerabilities in crypto space. Sometimes smart contracts don't anticipate the side-effects of giving execution to another, potentially malicious, contract halfway through executing a function.

## Completing the Challenges

In order to complete a challenge, you need to add your exploit code to the test file with the same name. After writing your exploit, the associated challenge's test can be triggered by running:

`npx hardhat test test/<challenge name>.js`

## Hardhat Javascript Gotcha's

* How to import `ethers` from `hardhat`:

```js
const { ethers } = require('hardhat');
```

* How to get test signers/wallets:

```js
    let [ as, many, as, we, want ] = await ethers.getSigners();
    console.log(`many's ethereum balance: ${await ethers.provider.getBalance(many.address)}`);
```

* How to deploy a contract:

```js
    let contractFactory = await ethers.getContractFactory('ContractName', defaultSigner);
    let contractInstance = await contractFactory.deploy(/* constructor arguments*/);
```

* How to call a contract instance's functions:

```js
    // getting a user's balance in the SolidityIntro contract
    let balance = await solidityIntroInstance.balances(address);

    // attaching ethereum to a function call
    await solidityIntroInstance.buyTokens(100, { value: ethers.utils.parseEther("50") });

    // calling a function using a different signer/wallet to the default
    await solidityIntroInstance.connect(differentSigner).buyTokens(100, { value: ethers.utils.parseEther("50") });
```

## Soldity Gotcha's

* How to define a basic contract:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// define contract with name Counter
contract Counter {
    // add a private state variable (accessible only by this contract, unless querying storage directly)
    uint256 private _counter; 
    // add a public state variable (accessible by anybody, by calling owner() on this contract)
    address public owner;

    // add a constructor, optional
    constructor() {
        owner = msg.sender;
    }

    // add a publicly-accessible function to increment _counter
    function increment() public {
        _counter++;
    }

    // add a publicly-accessible function to decrement _counter
    function decrement() public {
        _counter--;
    }

    // add a getter for _counter
    function getCounter() public view returns (uint256) {
        return _counter;
    }
}
```

* How to revert a transaction:

```
    function increment() public {
        // require will revert the tx if the condition is false
        require(msg.sender == owner, "Only the owner can increment");
        _counter++;
    }
```

* How to call an external/public function in another contract:

```solidity
// define an interface, which only has to include the functions you want to call
interface ICounter {
    function getCounter() external view returns (uint256);
}

contract MyContract {
    ICounter _counter;

    constructor(address counter) {
        // we "cast" the address to the interface
        _counter = ICounter(counter);
    }

    function counter() public view returns (uint256) {
        // we simply call the functions defined in our interface
        return _counter.getCounter();
    }

    function counterAtDifferentLocation(
        // we can also just do the cast seemlessly as an argument
        ICounter counter1,
        address counter2
    ) public view returns (uint256, uint256) {
        uint256 v1 = counter1.getCounter();
        // or we can cast it on the fly, same as before
        uint256 v2 = ICounter(counter2).getCounter());

        // and we can return tuples
        return (v1, v2);
    }
}

```

* How to define a function that accepts ethereum:

```solidity

    // by adding the payable modifier
    function givemeeth() public payable {
        // with some code, if you like
    }

    // or by defining a receive function:
    receive() external payable {}
```

* How to define a "default" function in your contract:

```solidity
    fallback() external /* can also add payable, if you like */ {
        // if a function is called in your contract that does not exist,
        // the fallback() function will get called, if it is defined
    }
```
