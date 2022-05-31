require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.13",
    networks: {
        fantom: {
            url: process.env.ANKR_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
};
