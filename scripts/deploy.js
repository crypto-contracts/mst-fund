async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const safe = "0x60237d87b2d8336851f1d3dc59f29b1472d1b189";
    // usdc
    // const token = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";
    // WFTM
    const token = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";
    const MSTFund = await ethers.getContractFactory("MSTFund");
    const mstFund = await MSTFund.deploy(safe);

    const MintNFT = await ethers.getContractFactory("MintNFT");
    const mintNFT = await MintNFT.deploy(safe, token, mstFund.address);

    console.log("FundNFT address:", fundNft.address);
    console.log("MintNFT address:", mintNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
