const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  console.log(`Preparing deployment...\n`);

  //Fetch contract to deploy
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");

  // Fetch accounts
  const accounts = await ethers.getSigners();

  console.log(
    `Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`
  );

  //Deploy contract
  const mRUPC = await Token.deploy("Mock Rupee Coin", "mRUPC", "1000000");
  await mRUPC.deployed();
  console.log(`mRUPC Token deployed to: ${mRUPC.address}`);

  const mDai = await Token.deploy("Mock Dai", "mDai", "1000000");
  await mDai.deployed();
  console.log(`mDai Token deployed to: ${mDai.address}`);

  const mWETH = await Token.deploy("Mock Wrapped Ether", "mWETH", "1000000");
  await mWETH.deployed();
  console.log(`mWETH Token deployed to: ${mWETH.address}`);

  const exchange = await Exchange.deploy(accounts[1].address, 10);
  await exchange.deployed();
  console.log(`Exchange Deployed to: ${exchange.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
