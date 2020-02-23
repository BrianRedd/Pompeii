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
  let newGrid = {};
  switch (type) {
    case actions.ADD_GRID:
      return {
        ...state,
        grid: payload
      };
    case actions.PLACE_PERSON:
      newGrid = { ...state.grid[payload.squareId] };
      newGrid.occupants = payload.occupants;
      return {
        ...state,
        grid: {
          ...state.grid,
          [payload.squareId]: newGrid
        }
      };
    default:
      return state;
  }
};

export default gridState;
