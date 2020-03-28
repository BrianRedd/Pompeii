/** @module FlagsReducer */

import * as actions from "../ActionTypes";
import * as types from "../../types/types";
import flagsList from "../../data/flags";

/**
 * @constant defaultFlags
 * @description Takes flagsList array of Objects, filters out those that
 * do are not true by default, and maps to array of names only
 */
const defaultFlags = flagsList.filter(t => t.defaultState).map(t => t.name);

/**
 * @constant flagsState
 * @param {Object} state - flags state object
 * @param {Object} action
 */
const flagsState = (
  state = { ...types.flagsState.defaults, flags: defaultFlags },
  action
) => {
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
        runCount: payload
      };
    case actions.SET_RELATIVES_COUNTER:
      return {
        ...state,
        relativesCount: payload
      };
    case actions.SET_ERUPTION_COUNTER:
      return {
        ...state,
        eruptionCount: payload
      };
    default:
      return state;
  }
};

export default flagsState;
