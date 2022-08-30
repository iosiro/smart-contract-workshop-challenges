const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

async function main() {
    // Let's start off with getting some sample accounts
    let [ deployer, user1, user2, minter ] = await ethers.getSigners();

    // And let's print the user addresses and eth balances
    await printUserDetails([user1, user2]);

    // So, deployer decides to create the new and innovative ~SolidityIntro~ token
    // BUT deployer first has to deploy the contract!

    // First off, deployer creates a contract factory for the SolidityIntro contract
    // This can be used over and over again, in code, to deploy new instances
    // The first argument is the name of the contract, and ethers does some magic to
    // go find the contract under the contracts/ directory
    // The second argument is a signer, which will automatically be used as the deployer
    // for the contract factory.
    let solidityIntroFactory = await ethers.getContractFactory("SolidityIntro", deployer);

    // Next, the SolidityIntro contract can be deployed!
    // But, remember, the constructor of the SolidityIntro contract expects an address
    // for the minter user. So we'll give it the minter account's address.
    let solidityIntroContract = await solidityIntroFactory.deploy(minter.address);

    console.log(`[2] solidityIntroContract was deployed to ${solidityIntroContract.address}`);

    // to test the newly-deployed contract, let's get the price in eth for 100 tokens
    let priceInEth = await solidityIntroContract.priceForTokens(100);
    console.log(`[3] price for 100 tokens: ${ethers.utils.formatUnits(priceInEth, 18)} eth`);

    // let's call the mint function, and mint some tokens! remember, the mint function is 
    // restricted to the mint user using the onlyMinter modifier, so we need to tell hardhat 
    // to use the mint user as signer, using .connect()
    await solidityIntroContract.connect(minter).mint(deployer.address, 100);

    // and let's confirm that deployer has been minted 100 tokens by getting their balance
    console.log(`[4] deployer balance: ${await solidityIntroContract.balanceOf(deployer.address)} tokens`);

    // To demonstrate attaching eth to a transaction, user1 is going to buy some tokens.
    // The final argument to a solidity contract function call when using ethers/hardhat allows
    // specifying the amount of eth to attach, gaslimit, and other parameters.
    // I.e., user1 wants to buy 100 tokens, and needs to pay 50 eth for it:
    await solidityIntroContract.connect(user1).buyTokens(100, {
        // we could have used priceInEth, but to demonstrate a quick way to convert
        // to uint256 18 decimals, there is the parseEther() method, which is used quite a lot 
        value: ethers.utils.parseEther("50") 
    });

    console.log(`[5] user1 balance: ${await solidityIntroContract.balanceOf(user1.address)} tokens`);

    // Last thing! When a transaction reverts, an exception is thrown in this here Javascript.
    // To handle it, simply wrap in a try/catch
    try {
        // Throw an exception buy buying tokens with incorrect amount of eth attached
        await solidityIntroContract.connect(user2).buyTokens(100, { value: ethers.utils.parseEther("1")});
    } catch (e) {
        console.log(`[6] ${e.toString()}`);
    }

    // But not to worry! If you don't handle exceptions like above, you can still get your error message.
    await solidityIntroContract.connect(user2).sellTokens(500);
}

async function printUserDetails(accounts) {
    console.log("[1] user eth balances: ");

    for (let i = 0; i < accounts.length; i++) {
        // Get the account's address
        let address = accounts[i].address;

        // Get the account's balance, using its address
        let balance = await ethers.provider.getBalance(address);

        // Remember that eth is 18 decimals, and balances are represented as uint256.
        // But can use ethers to format some BigNumber to a floating point number with
        // the desired amount of decimals!
        let balancePretty = ethers.utils.formatUnits(balance, 18);

        console.log(`\tAccount ${address} has balance ${balancePretty} eth (${balance})`);
    }
}

main().then().catch((e) => { console.log(e); process.exit(1); });