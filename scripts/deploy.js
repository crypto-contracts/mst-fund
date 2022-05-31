async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const safe = "0x60237d87b2d8336851f1d3dc59f29b1472d1b189";
    // usdc
    const token = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";
    const FundNFT = await ethers.getContractFactory("FundNFT");
    const fundNft = await FundNFT.deploy(deployer.address);

    const MintFundNFT = await ethers.getContractFactory("MintFundNFT");
    const mintFundNFT = await MintFundNFT.deploy(safe, token, fundNft.address);

    console.log("FundNFT address:", fundNft.address);
    console.log("MintFundNFT address:", mintFundNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
