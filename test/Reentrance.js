const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Reentrance', function () {
    let deployer, attacker;

    before(async function() {
        [deployer, attacker] = await ethers.getSigners();

        // deploy Reentrance contract
        this.reentrance = await (await ethers.getContractFactory('Reentrance', deployer)).deploy();
        
        // pre-fund Reentrance contract with 100 ether
        await this.reentrance.deposit({
            value: ethers.utils.parseEther('100')
        });
    });

    it('attempts to steal all the ether in the contract', async function() {
        // WRITE EXPLOIT HERE
    });

    after(async function() {
        // expect the eth balance of the Reentrance contract to be zero
        expect(
            await ethers.provider.getBalance(this.reentrance.address),
            'The ether balance of the Reentrance contract is not zero'
        ).to.be.eq(0);
    });

});