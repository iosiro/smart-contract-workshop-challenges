const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Telephone', function () {
    let deployer, attacker;

    before(async function() {
        [deployer, attacker] = await ethers.getSigners();

        // deploy Telephone contract, where deployer will be the initial owner
        this.Telephone = await (await ethers.getContractFactory("Telephone", deployer)).deploy();
    });

    it('Exploit', async function() {
        // WRITE EXPLOIT HERE
    });

    after(async function() {
        // expect attacker to be the new owner of the Telephone contract
        expect(
            await this.Telephone.owner()
        ).to.be.eq(attacker.address);
    });

});