/** @module GamePlayReducer */

import * as actions from "../ActionTypes";
import * as types from "../../types/types";

/**
 * @constant gamePlayState
 * @param {Object} state - cards state object
 * @param {Object} action
 */
const gamePlayState = (state = types.gamePlayState.defaults, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.ADD_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: payload
      };
    case actions.SET_PLACED_RELATIVES:
      return {
        ...state,
        placedRelatives: payload
      };
    default:
      return state;
  }
};

export default gamePlayState;
