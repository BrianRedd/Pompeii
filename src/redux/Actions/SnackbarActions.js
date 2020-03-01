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
