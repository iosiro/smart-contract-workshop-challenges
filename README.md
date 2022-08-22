# Install Dependencies

`npm install`

# Solidity/Javascript Example Code

The `SolidityIntro` contract (`contracts/SolidityIntro.sol`) and `JavascriptExampleCode.js` script (`scripts/JavascriptExampleCode.js`) provide some example syntax to get around from scratch. The `SolidityIntro` contract demonstrates some basic language concepts, and the `JavascriptExampleCode.js` script shows how to deploy and interact with smart contracts using `hardhat`'s `ethers` module. It should be sufficient to get you going. To run the example Javascript code, execute the following:

`npx hardhat run scripts/JavascriptExampleCode.js`

# Challenges

The challenge contracts can all be found in the `contracts` directory. A suggestion is to try complete them from easy to difficult, implying the following order:

* `Telephone.sol`: How could `msg.sender` potentially change over the course of a transaction?
* `CoinFlip.sol` - It's a game of chance on a thing that is inherintly deterministic. Smart.
* `Reentrancy.sol` - Perhaps one of the most common classes of vulnerabilities in crypto space. Sometimes smart contracts don't anticipate the side-effects of giving execution to another, potentially malicious, contract halfway through executing a function.

## Completing the Challenges

In order to complete a challenge, you need to add your exploit code to the test file with the same name. After writing your exploit, the associated challenge's test can be triggered by running:

`npx hardhat test test/<challenge name>.js`
