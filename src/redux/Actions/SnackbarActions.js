/** @module SnackbarActions */

import { ADD_SNACKBAR } from "../ActionTypes";

/**
 * @function addSnackbar
 * @description sets message state
 * @param {Object} messageObj
 * @example { message: "message", type: "type" }
 */
export const addSnackbar = messageObj => ({
  type: ADD_SNACKBAR,
  payload: messageObj
});

/**
 * @function dispatchSnackbar
 * @description dispatches addSnackbar
 * @param {Object} messageObj
 */
export const dispatchSnackbar = messageObj => dispatch => {
  dispatch(addSnackbar(messageObj));
};
