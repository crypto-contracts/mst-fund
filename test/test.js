const {expect} = require("chai");
const {BigNumber} = require("ethers");
const {ethers} = require("hardhat");

describe("NFTFUND", function () {
    let owner;
    let addr1;
    let fundNft;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        const FundNFT = await ethers.getContractFactory("FundNFT");
        fundNft = await FundNFT.deploy(owner.address);
    });

    it("Should mint an NFT", async function () {
        const minterRole = await fundNft.MINTER_ROLE();
        // console.log(minterRole);
        await fundNft.grantRole(minterRole, owner.address);

        await fundNft.mint(owner.address, 10, 100);

        expect(await fundNft.ownerOf(1)).to.equal(owner.address);
        expect(await fundNft.shareMap(1)).to.equal(10);
        expect(await fundNft.valueMap(1)).to.equal(100);
    });

    it("Should fail if sender donesn't have minter-role", async function () {
        const minterRole = await fundNft.MINTER_ROLE();
        await expect(fundNft.mint(owner.address, 10, 100)).to.be.revertedWith(
            `AccessControl: account ${owner.address.toLowerCase()} is missing role ${minterRole}`
        );
    });
});

describe("MINT NFTFUND", function () {
    let owner;
    let addr1;
    let fundNft;
    let token;
    let mintFundNFT;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        const FundNFT = await ethers.getContractFactory("FundNFT");
        fundNft = await FundNFT.deploy(owner.address);

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();

        const MintFundNFT = await ethers.getContractFactory("MintFundNFT");
        mintFundNFT = await MintFundNFT.deploy(
            addr1.address,
            token.address,
            fundNft.address
        );
    });

    it("Should fail if the value is not correct", async function () {
        const minterRole = await fundNft.MINTER_ROLE();
        await fundNft.grantRole(minterRole, mintFundNFT.address);

        await expect(
            mintFundNFT.deposit("10000000000000000000")
        ).to.be.revertedWith("value is not correct");
    });

    it("Should success mint an nft for 1 share", async function () {
        const minterRole = await fundNft.MINTER_ROLE();
        await fundNft.grantRole(minterRole, mintFundNFT.address);

        await mintFundNFT.deposit("100000000000000000000");

        expect(await fundNft.ownerOf(1)).to.equal(owner.address);
        expect(await fundNft.shareMap(1)).to.equal(1);
        expect(await fundNft.valueMap(1)).to.equal("100000000000000000000");
        expect(await token.balanceOf(addr1.address)).to.equal(
            "100000000000000000000"
        );
    });

    it("Should fail if mintFundNFT donesn't have minter-role", async function () {
        const minterRole = await fundNft.MINTER_ROLE();
        await expect(
            mintFundNFT.deposit("100000000000000000000")
        ).to.be.revertedWith(
            `AccessControl: account ${mintFundNFT.address.toLowerCase()} is missing role ${minterRole}`
        );
    });

    it("Should merge with two NFT", async function () {
        const minterRole = await fundNft.MINTER_ROLE();
        await fundNft.grantRole(minterRole, mintFundNFT.address);
        // 1 share
        await mintFundNFT.deposit("100000000000000000000");
        // 10 share
        await mintFundNFT.deposit("1000000000000000000000");

        await fundNft.merge(1, 2);
        expect(await fundNft.shareMap(2)).to.equal(11);
        expect(await fundNft.valueMap(2)).to.equal("1100000000000000000000");
    });
});
