/** @module MessageReducer */

import * as actions from "../ActionTypes";
import * as types from "../../types/types";

/**
 * @constant messageState
 * @param {Object} state - message state object
 * @param {Object} action
 */
const messageState = (state = types.messageState.defaults, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.SET_STAGE:
      return {
        ...state,
        stage: payload
      };
    case actions.UPDATE_INSTRUCTIONS:
      return {
        ...state,
        instruction: payload
      };
    default:
      return state;
  }
};

export default messageState;
