const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Reentrance', function () {
    let deployer, attacker;

    before(async function() {
        [deployer, attacker] = await ethers.getSigners();

        // deploy Reentrance contract
        this.reentrance = await (await ethers.getContractFactory("Reentrance", deployer)).deploy();
        
        // pre-fund Reentrance contract with 100 eth
        await this.reentrance.donate(deployer.address, {
            value: ethers.utils.parseEther("100")
        });
    });

    it('Exploit', async function() {
        // WRITE EXPLOIT HERE
    });

    after(async function() {
        // expect the eth balance of the Reentrance contract to be zero
        expect(
            await ethers.provider.getBalance(this.reentrance.address)
        ).to.be.eq(0);
    });

});