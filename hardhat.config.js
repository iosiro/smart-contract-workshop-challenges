require("@nomiclabs/hardhat-waffle");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.7" },
      { version: "0.7.6" },
      { version: "0.6.6" }
    ]
  }
};
