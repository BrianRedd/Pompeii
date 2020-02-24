/** @module TilesReducer */

import * as actions from "../ActionTypes";

/**
 * @constant tileState
 * @param {Object} state - cards state object
 * @param {Object} action
 */
const tileState = (
  state = {
    tiles: {},
    pile: []
  },
  action
) => {
  const { type, payload } = action;
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
      return {
        ...state,
        pile: state.pile.slice(0, -1)
      };
    default:
      return state;
  }
};

export default tileState;
