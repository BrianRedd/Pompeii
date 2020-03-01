/** @module configureStore */

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import cardsState from "./Reducers/CardsReducer";
import flagsState from "./Reducers/FlagsReducer";
import gridState from "./Reducers/GridReducer";
import messageState from "./Reducers/MessageReducer";
import playersState from "./Reducers/PlayersReducer";
import tileState from "./Reducers/TilesReducer";

const logger = createLogger({ collapsed: true, diff: true });

const ConfigureStore = () => {
  const storeTemplate = createStore(
    combineReducers({
      cardsState,
      flagsState,
      gridState,
      messageState,
      playersState,
      tileState
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
