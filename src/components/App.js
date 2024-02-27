import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import TOKEN_ABI from "../abis/Token.json";
import config from "../config.json";
import "../App.css";

import { loadProvider, loadNetwork, loadAccount } from "../store/interactions";

function App() {
  const dispatch = useDispatch();
  const loadBlockchainData = async () => {
    const account = await loadAccount(dispatch);
    console.log(account);

    // Connect ethers to blockchain
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);
    console.log(chainId);

    // Token Smart Contract
    const token = new ethers.Contract(
      config[chainId].mRUPC.address,
      TOKEN_ABI,
      provider
    );
    const symbol = await token.symbol();
    console.log(symbol);
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      {/* Navbar */}

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}

          {/* Balance */}

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
