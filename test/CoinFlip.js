const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] CoinFlip', function () {

    before(async function() {
        // deploy the CoinFlip contract
        this.CoinFlip = await (await ethers.getContractFactory("CoinFlip")).deploy();
    });

    it('Exploit', async function() {
        // WRITE EXPLOIT HERE

    });

    after(async function() {
        // expect 10 consecutive wins in the CoinFlip contract
        expect(
            await this.CoinFlip.consecutiveWins()
        ).to.be.eq(10);


    });

});