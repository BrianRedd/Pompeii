/** @module GridReducer */

import * as actions from "../ActionTypes";
import * as types from "../../types/types";

/**
 * @constant gridState
 * @param {Object} state - cards state object
 * @param {Object} action
 */
const gridState = (state = types.gridState.defaults, action) => {
  const { type, payload } = action;
  let newGrid = {};
  switch (type) {
    case actions.ADD_GRID:
      return {
        ...state,
        grid: payload
      };
    case actions.PLACE_PEOPLE:
      newGrid = { ...state.grid[payload.squareId] };
      newGrid.occupants = payload.occupants;
      return {
        ...state,
        grid: {
          ...state.grid,
          [payload.squareId]: newGrid
        }
      };
    case actions.PLACE_LAVA:
      newGrid = { ...state.grid[payload.squareId] };
      newGrid.lava = payload.tile;
      return {
        ...state,
        grid: {
          ...state.grid,
          [payload.squareId]: newGrid
        }
      };
    case actions.UPDATE_DISTANCE_TO_EXIT:
      newGrid = { ...state.grid[payload.squareId] };
      newGrid.distanceToExit = payload.distance;
      return {
        ...state,
        grid: {
          ...state.grid,
          [payload.squareId]: newGrid
        }
      };
    case actions.SET_DANGER_ZONE:
      return {
        ...state,
        dangerZone: payload
      };
    default:
      return state;
  }
};

export default gridState;
