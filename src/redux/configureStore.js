/** @module configureStore */

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import cardsState from "./Reducers/cardsReducer";
import playersState from "./Reducers/playersReducer";

const logger = createLogger({ collapsed: true, diff: true });

const ConfigureStore = () => {
  const storeTemplate = createStore(
    combineReducers({
      cardsState,
      playersState
    }),
    /* eslint-disable no-underscore-dangle */
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    /* eslint-enable no-underscore-dangle */
    applyMiddleware(thunk, logger)
  );
  return storeTemplate;
};

const store = ConfigureStore();

export default store;
