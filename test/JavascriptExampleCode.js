const { ethers } = require('hardhat');
const { expect } = require('chai');

describe("SolidityIntro Tests", async function() {
    let deployer, user1, user2, minter;
    let priceOracleInstance, solidityIntroInstance;

    beforeEach(async function() {
        // get the signers
        [deployer, user1, user2, minter] = await ethers.getSigners();

        // deploy PriceOracle contract
        let priceOracleFactory = await ethers.getContractFactory("PriceOracle", deployer);
        priceOracleInstance = await priceOracleFactory.deploy();
    
        // deploy SolidityIntro contract
        let solidityIntroFactory = await ethers.getContractFactory("SolidityIntro", deployer);
        solidityIntroInstance = await solidityIntroFactory.deploy(minter.address, priceOracleInstance.address);
    });

    it("Gets a signer's ethereum balance", async function() {
        let balance = await ethers.provider.getBalance(user1.address);
        expect(balance).to.be.eq(ethers.utils.parseEther("10000"));
    });

    it("Ensures the price is 0.5 eth", async function() {
        // get price of two tokens, which is 0.5 * 2 = 1
        let priceViaSolidityIntro = await solidityIntroInstance.priceOf(2);
        expect(priceViaSolidityIntro).to.be.eq(ethers.utils.parseEther("1"));

        // get price directly from oracle, which is 0.5
        let priceFromOracle = await priceOracleInstance.getLatestPrice();
        expect(priceFromOracle).to.be.eq(ethers.utils.parseEther("0.5"));
    });

    it("Attempts to buy a token by attaching ethereum", async function() {
        // buy 1 token as user1, attaching 0.5 ether
        await solidityIntroInstance.connect(user1).buyTokens(1, {value: ethers.utils.parseEther("0.5")});
        let user1Balance = await solidityIntroInstance.balances(user1.address);
        expect(user1Balance.toNumber()).to.be.eq(1);

        // buy 1 token as user2, but don't attach any ether
        // wrap in try/catch, as we expect it to revert
        try {
            await solidityIntroInstance.connect(user2).buyTokens(1);
        } catch {}
        let user2Balance = await solidityIntroInstance.balances(user2.address);
        expect(user2Balance.toNumber()).to.be.eq(0);
    });

    it("Attempts to buy a token, and then sell it", async function() {
        // buy 1 token as user1, attaching 0.5 ether
        await solidityIntroInstance.connect(user1).buyTokens(1, {value: ethers.utils.parseEther("0.5")});
        let user1Balance = await solidityIntroInstance.balances(user1.address);
        expect(user1Balance.toNumber()).to.be.eq(1);

        // user1 sells the token
        await solidityIntroInstance.connect(user1).sellTokens(1);
        user1Balance = await solidityIntroInstance.balances(user1.address);
        expect(user1Balance.toNumber()).to.be.eq(0);
    });

    it("Ensures minting is restricted to the minter role", async function() {
        // user1 tries to mint themselves some tokens
        try {
            await solidityIntroInstance.connect(user1).mint(user1.address, 1000);
        } catch{}
        let user1Balance = await solidityIntroInstance.balances(user1.address);
        expect(user1Balance.toNumber()).to.be.eq(0);

        // minter tries to mint user2 some tokens
        await solidityIntroInstance.connect(minter).mint(user2.address, 100);
        let user2Balance = await solidityIntroInstance.balances(user2.address);
        expect(user2Balance.toNumber()).to.be.eq(100);
    });

    it("Deliberately fails a test to see what that looks like", async function() {
        expect(1, "Don't panic! This test is meant to fail.").to.be.eq(0);
    });
});