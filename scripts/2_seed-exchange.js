const config = require("../src/config.json");

const hre = require("hardhat");
const ethers = hre.ethers;

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
  // Fetch accounts from wallet - these are unlocked
  const accounts = await ethers.getSigners();

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork();
  console.log("Using chainId:", chainId);

  const mRUPC = await ethers.getContractAt(
    "Token",
    config[chainId].mRUPC.address
  );
  console.log(`mRUPC Token fetched: ${mRUPC.address}\n`);

  const mDai = await ethers.getContractAt(
    "Token",
    config[chainId].mDai.address
  );
  console.log(`mDai Token fetched: ${mDai.address}\n`);

  const mWETH = await ethers.getContractAt(
    "Token",
    config[chainId].mWETH.address
  );
  console.log(`mWETH Token fetched: ${mWETH.address}\n`);

  // Fetch the deployed exchange
  const exchange = await ethers.getContractAt(
    "Exchange",
    config[chainId].exchange.address
  );
  console.log(`Exchange fetched: ${exchange.address}\n`);

  // Give tokens to account[1]
  const sender = accounts[0];
  const receiver = accounts[1];
  let amount = tokens(10000);

  // user1 transfers 10,000 mWETH...
  let transaction, result;
  transaction = await mWETH.connect(sender).transfer(receiver.address, amount);
  await transaction.wait();
  console.log(
    `Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`
  );

  // Set up exchange users
  const user1 = accounts[0];
  const user2 = accounts[1];
  amount = tokens(10000);

  // user1 approves 10,000 mRUPC...
  transaction = await mRUPC.connect(user1).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user1.address}\n`);

  // user1 deposits 10,000 mRUPC...
  transaction = await exchange
    .connect(user1)
    .depositToken(mRUPC.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} Ether from ${user1.address}\n`);

  // user2 approves 10,000 mWETH...
  transaction = await mWETH.connect(user2).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user2.address}\n`);

  // user2 deposits 10,000 mWETH...
  transaction = await exchange
    .connect(user2)
    .depositToken(mWETH.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} Ether from ${user2.address}\n`);

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Seed a Cancelled Order
  //

  // user1 makes order to get tokens
  let orderId;
  transaction = await exchange
    .connect(user1)
    .makeOrder(mWETH.address, tokens(100), mRUPC.address, tokens(5));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}\n`);

  // user 1 cancels order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user1).cancelOrder(orderId);
  result = await transaction.wait();
  console.log(`Cancelled order from ${user1.address}\n`);

  // Wait 1 second
  await wait(1);

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Seed Filled Orders
  //

  // user1 makes order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mWETH.address, tokens(100), mRUPC.address, tokens(10));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}\n`);

  // user2 fills order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user2.address}\n`);

  // Wait 1 second
  await wait(1);

  // user1 makes another order
  transaction = await exchange.makeOrder(
    mWETH.address,
    tokens(50),
    mRUPC.address,
    tokens(15)
  );
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}\n`);

  // user2 fills another order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  // Wait 1 second
  await wait(1);

  // user1 makes final order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mWETH.address, tokens(200), mRUPC.address, tokens(20));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}\n`);

  // user2 fills final order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  // Wait 1 second
  await wait(1);

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // Seed Filled Orders
  //

  // user1 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    exchange
      .connect(user1)
      .makeOrder(mWETH.address, tokens(i * 10), mRUPC.address, tokens(i * 8));
    result = await transaction.wait();
    console.log(`Made order from ${user1.address}\n`);

    // Wait 1 second
    await wait(1);
  }

  // user2 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    exchange
      .connect(user2)
      .makeOrder(mRUPC.address, tokens(i * 8), mWETH.address, tokens(i * 10));
    result = await transaction.wait();
    console.log(`Made order from ${user2.address}\n`);

    // Wait 1 second
    await wait(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
