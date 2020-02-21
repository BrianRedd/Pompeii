/** @module GridReducer */

import * as actions from "../ActionTypes";
import * as types from "../../types/types";

/**
 * @constant gridState
 * @param {Object} state - cards state object
 * @param {Object} action
 */
const gridState = (state = { grid: types.grid.defaults }, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.ADD_GRID:
      return {
        ...state,
        grid: payload
      };
    case actions.UPDATE_GRID_SQUARE:
      return {
        ...state,
        grid: {
          ...state.grid,
          [payload.squareId]: {
            ...state.grid[payload.squareId],
            ...payload.squareObj
          }
        }
      };
    default:
      return state;
  }
};

export default gridState;
