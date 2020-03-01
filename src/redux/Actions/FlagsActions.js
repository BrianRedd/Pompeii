/** @module FlagsActions */

import * as actionTypes from "../ActionTypes";

/**
 * @function toggleFlags
 * @description adds or removes flag name to flagState,
 * used to determine if flag et al is on or off
 * @param {String} toggle - name of flag being toggled
 */
export const toggleFlags = flag => ({
  type: actionTypes.TOGGLE_FLAGS,
  payload: flag
});

/**
 * @function setRunCounter
 * @description updates run counter within flagState
 * @param {Number} counter - counter (replacing existing)
 */
export const setRunCounter = counter => ({
  type: actionTypes.SET_RUN_COUNTER,
  payload: counter
});
