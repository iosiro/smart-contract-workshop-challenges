const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Walkthrough', function () {
    let deployer, attacker;

    before(async function() {
        [deployer, caller] = await ethers.getSigners();

        // deploy Walkthrough contract
        this.walkthrough = await (
            await ethers.getContractFactory('Walkthrough', deployer)
        ).deploy();
    });

    it('attempts to call callMe from an EOA', async function() {

    });

    it('attempts to call callMe from a contract', async function() {

    });

});