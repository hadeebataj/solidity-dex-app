import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { legacy_createStore, combineReducers, applyMiddleware } from "redux";

/* Import Reducers */
import { provider, tokens, exchange } from "./reducers";

const reducer = combineReducers({
  provider,
  tokens,
  exchange,
});
const initialState = {};
const middleware = [thunk];

// configureStore or createStore
const store = legacy_createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
