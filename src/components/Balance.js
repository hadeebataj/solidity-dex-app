import React, { useEffect, useState, useRef } from "react";
import dapp from "../assets/dapp.svg";
import eth from "../assets/eth.svg";

import { useDispatch, useSelector } from "react-redux";
import { loadBalances, transferTokens } from "../store/interactions";

const Balance = () => {
  const [token1TransferAmount, setToken1TransferAmount] = useState(0);
  const [token2TransferAmount, setToken2TransferAmount] = useState(0);
  const [isDeposit, setIsDeposit] = useState(true);

  const dispatch = useDispatch();
  const symbols = useSelector((state) => state.tokens.symbols);
  const exchange = useSelector((state) => state.exchange.contract);
  const exchangeBalances = useSelector((state) => state.exchange.balances);
  const tokens = useSelector((state) => state.tokens.contracts);
  const tokenBalances = useSelector((state) => state.tokens.balances);
  const account = useSelector((state) => state.provider.account);
  const provider = useSelector((state) => state.provider.connection);
  const transferInProgress = useSelector(
    (state) => state.exchange.transferInProgress
  );

  const depositRef = useRef();
  const withdrawRef = useRef();

  const tabHandler = (e) => {
    if (e.target.className !== depositRef.current.className) {
      e.target.className = "tab tab--active";
      depositRef.current.className = "tab";
      setIsDeposit(false);
    } else {
      e.target.className = "tab tab--active";
      withdrawRef.current.className = "tab";
      setIsDeposit(true);
    }
  };

  const amountHandler = (e, token) => {
    if (token.address === tokens[0].address) {
      setToken1TransferAmount(e.target.value);
    } else {
      setToken2TransferAmount(e.target.value);
    }
  };

  // Step 1: Do transfer
  // Step 2: Notify app that transfer is pending
  // Step 3: Get confirmation from blockchain that transfer was successful
  // Step 4: Notify app that transfer was successful
  // Step 5: Handle transfer failed -> notify app

  const depositHandler = (e, token) => {
    e.preventDefault();
    if (token.address === tokens[0].address) {
      transferTokens(
        provider,
        exchange,
        "Deposit",
        token,
        token1TransferAmount,
        dispatch
      );
      setToken1TransferAmount(0);
    } else {
      transferTokens(
        provider,
        exchange,
        "Deposit",
        token,
        token2TransferAmount,
        dispatch
      );
      setToken2TransferAmount(0);
    }
  };

  const withdrawHandler = (e, token) => {
    e.preventDefault();
    if (token.address === tokens[0].address) {
      transferTokens(
        provider,
        exchange,
        "Withdraw",
        token,
        token1TransferAmount,
        dispatch
      );
      setToken1TransferAmount(0);
    } else {
      transferTokens(
        provider,
        exchange,
        "Withdraw",
        token,
        token2TransferAmount,
        dispatch
      );
      setToken2TransferAmount(0);
    }
  };

  useEffect(() => {
    if (exchange && tokens[0] && tokens[1] && account) {
      loadBalances(exchange, tokens, account, dispatch);
    }
  }, [exchange, tokens, account, transferInProgress]);

  return (
    <div className="component exchange__transfers">
      <div className="component__header flex-between">
        <h2>Balance</h2>
        <div className="tabs">
          <button
            onClick={tabHandler}
            ref={depositRef}
            className="tab tab--active"
          >
            Deposit
          </button>
          <button onClick={tabHandler} ref={withdrawRef} className="tab">
            Withdraw
          </button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (mRUPC) */}

      <div className="exchange__transfers--form">
        <div className="flex-between">
          <p>
            <small>Token</small>
            <br />
            <img src={dapp} alt="Token logo" />
            {symbols && symbols[0]}
          </p>
          <p>
            <small>Wallet</small>
            <br />
            {tokenBalances && tokenBalances[0]}
          </p>
          <p>
            <small>Exchange</small>
            <br />
            {exchangeBalances && exchangeBalances[0]}
          </p>
        </div>

        <form
          onSubmit={
            isDeposit
              ? (e) => depositHandler(e, tokens[0])
              : (e) => withdrawHandler(e, tokens[0])
          }
        >
          <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
          <input
            type="text"
            id="token0"
            placeholder="0.0000"
            value={token1TransferAmount === 0 ? "" : token1TransferAmount}
            onChange={(e) => amountHandler(e, tokens[0])}
          />

          <button className="button" type="submit">
            <span>{isDeposit ? "Deposit" : "Withdraw"}</span>
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mWETH) */}

      <div className="exchange__transfers--form">
        <div className="flex-between">
          <p>
            <small>Token</small>
            <br />
            <img src={eth} alt="Token logo" />
            {symbols && symbols[1]}
          </p>
          <p>
            <small>Wallet</small>
            <br />
            {tokenBalances && tokenBalances[1]}
          </p>
          <p>
            <small>Exchange</small>
            <br />
            {exchangeBalances && exchangeBalances[1]}
          </p>
        </div>

        <form
          onSubmit={
            isDeposit
              ? (e) => depositHandler(e, tokens[1])
              : (e) => withdrawHandler(e, tokens[1])
          }
        >
          <label htmlFor="token1">{symbols && symbols[1]} Amount</label>
          <input
            type="text"
            id="token1"
            placeholder="0.0000"
            value={token2TransferAmount === 0 ? "" : token2TransferAmount}
            onChange={(e) => amountHandler(e, tokens[1])}
          />

          <button className="button" type="submit">
            <span>{isDeposit ? "Deposit" : "Withdraw"}</span>
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
};

export default Balance;
