/** @module MessageActions */

import * as actionTypes from "../ActionTypes";
import { addSnackbar } from "./SnackbarActions";

import { stageData } from "../../data/messageData";

/**
 * @function incrementStageInStore
 * @description increments stage in MessageState store
 */
export const incrementStageInStore = () => ({
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

/**
 * @function incrementStageInStore
 * @description increments stage with snackbar
 */
export const incrementStage = () => (dispatch, getState) => {
  const {
    messageState: { stage }
  } = getState();
  dispatch(
    addSnackbar({
      message: stageData[stage + 1].text,
      type: "error"
    })
  );
  dispatch(incrementStageInStore());
};
