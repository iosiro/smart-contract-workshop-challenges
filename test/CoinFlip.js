const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] CoinFlip', function () {

    before(async function() {
        // deploy the CoinFlip contract
        this.coinFlip = await (await ethers.getContractFactory("CoinFlip")).deploy();
    });

    it('Exploit', async function() {
        // WRITE EXPLOIT HERE

    });

    after(async function() {
        // expect 10 consecutive wins in the CoinFlip contract
        expect(
            await this.coinFlip.consecutiveWins(),
            "The CoinFlip contract did not record 10 consecutive wins"
        ).to.be.eq(10);


    });

});