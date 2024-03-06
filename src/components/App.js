import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import config from "../config.json";
import "../App.css";

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
  subscribeToEvents,
} from "../store/interactions";

import Navbar from "./Navbar";
import Markets from "./Markets";
import Balance from "./Balance";

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    // Connect ethers to blockchain
    const provider = loadProvider(dispatch);

    // Fetch current network's chainId (eg: hardhat: 31337, sepolia: 1101)
    const chainId = await loadNetwork(provider, dispatch);

    // Reload page when network changes
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    // Fetch current account & balance from Metamask when changed
    window.ethereum.on("accountsChanged", () => {
      loadAccount(provider, dispatch);
    });

    // Token Smart Contract
    const mRUPC = config[chainId].mRUPC;
    const mWETH = config[chainId].mWETH;

    await loadTokens(provider, [mRUPC.address, mWETH.address], dispatch);

    // Load Exchange Smart Contract
    const exchangeConfig = config[chainId].exchange;
    const exchange = await loadExchange(
      provider,
      exchangeConfig.address,
      dispatch
    );

    // Listen to events
    subscribeToEvents(exchange, dispatch);
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      <Navbar />

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          <Markets />

          <Balance />

          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;
