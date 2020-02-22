/** @module MessageActions */

import * as actionTypes from "../ActionTypes";

/**
 * @function incrementStage
 * @description increments stage in MessageState store
 */
export const incrementStage = () => ({
  type: actionTypes.INCREMENT_STAGE,
  payload: null
});

/**
 * @function updateInstructions
 * @description updates instructions within MessageState store
 * @param {Object} instructionObj - instructions (replacing existing)
 */
export const updateInstructions = instructionObj => ({
  type: actionTypes.UPDATE_INSTRUCTIONS,
  payload: instructionObj
});
