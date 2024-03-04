import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

/* Import Reducers */
import { provider, tokens, exchange } from "./reducers";

// configureStore or createStore
const store = configureStore({
  reducer: {
    provider,
    tokens,
    exchange,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
  initialState: {},
});

export default store;
