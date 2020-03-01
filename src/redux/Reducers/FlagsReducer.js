/** @module FlagsReducer */

import * as actions from "../ActionTypes";
import * as types from "../../types/types";

/**
 * @constant flagsState
 * @param {Object} state - flags state object
 * @param {Object} action
 */
const flagsState = (state = types.flagsState.defaults, action) => {
  const { type, payload } = action;
  const { flags } = state;
  const newFlags = [...flags];
  const flagListIdx = flags.indexOf(payload);
  switch (type) {
    case actions.TOGGLE_FLAGS:
      if (flagListIdx === -1) {
        newFlags.push(payload);
      } else {
        newFlags.splice(flagListIdx, 1);
      }
      return {
        ...state,
        flags: newFlags
      };
    case actions.SET_RUN_COUNTER:
      return {
        ...state,
        runCounter: payload
      };
    default:
      return state;
  }
};

export default flagsState;
