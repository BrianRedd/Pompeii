/** @module configureStore */

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import cardsState from "./Reducers/CardsReducer";
import flagsState from "./Reducers/FlagsReducer";
import gamePlayState from "./Reducers/GamePlayReducer";
import gridState from "./Reducers/GridReducer";
import messageState from "./Reducers/MessageReducer";
import playersState from "./Reducers/PlayersReducer";
import snackbarState from "./Reducers/SnackbarReducer";
import tileState from "./Reducers/TilesReducer";

const logger = createLogger({ collapsed: true, diff: true });

const ConfigureStore = () => {
  const storeTemplate = createStore(
    combineReducers({
      cardsState,
      flagsState,
      gamePlayState,
      gridState,
      messageState,
      playersState,
      snackbarState,
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
