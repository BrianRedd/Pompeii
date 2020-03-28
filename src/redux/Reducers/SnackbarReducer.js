/**
 * @module SnackbarReducer
 * @description Reducer for Snackbar message data
 */

import { ADD_SNACKBAR } from "../ActionTypes";
import * as types from "../../types/types";

/**
 * @constant snackbarState
 * @param {Object} state - message Object
 * @param {Object} action
 */
const snackbarState = (state = types.snackbarState.defaults, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_SNACKBAR:
      return {
        ...state,
        message: payload.message,
        type: payload.type
      };
    default:
      return state;
  }
};

export default snackbarState;
