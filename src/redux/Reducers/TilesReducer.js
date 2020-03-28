/** @module TilesReducer */

import * as actions from "../ActionTypes";
import * as types from "../../types/types";

/**
 * @constant tileState
 * @param {Object} state - cards state object
 * @param {Object} action
 */
const tileState = (state = types.tileState.defaults, action) => {
  const { type, payload } = action;
  const newPile = [...state.pile];
  switch (type) {
    case actions.ADD_TILES:
      return {
        ...state,
        tiles: payload
      };
    case actions.ADD_TILE_PILE:
      return {
        ...state,
        pile: payload
      };
    case actions.TAKE_TILE:
      newPile.pop();
      return {
        ...state,
        pile: newPile
      };
    case actions.SET_LAVA_TILE:
      return {
        ...state,
        lavaTile: payload
      };
    default:
      return state;
  }
};

export default tileState;
