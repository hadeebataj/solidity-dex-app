import React from "react";
import config from "../config.json";
import { useDispatch, useSelector } from "react-redux";
import { loadTokens } from "../store/interactions";

const Markets = () => {
  const provider = useSelector((state) => state.provider.connection);
  const chainId = useSelector((state) => state.provider.chainId);
  const dispatch = useDispatch();

  const marketHandler = (e) => {
    const val = e.target.value;
    const addresses = val.split(",").map((address) => address.trim());
    loadTokens(provider, addresses, dispatch);
  };

  return (
    <div className="component exchange__markets">
      <div className="component__header">
        <h2>Select Market</h2>
      </div>
      {chainId && config[chainId] ? (
        <select name="markets" id="markets" onChange={marketHandler}>
          <option
            value={`${config[chainId].mRUPC.address}, ${config[chainId].mWETH.address}`}
          >
            mRUPC / mWETH
          </option>
          <option
            value={`${config[chainId].mRUPC.address}, ${config[chainId].mDai.address}`}
          >
            mRUPC / mDai
          </option>
        </select>
      ) : (
        <div>
          <p>Not deployed to network</p>
        </div>
      )}

      <hr />
    </div>
  );
};

export default Markets;
