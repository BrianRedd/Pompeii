/** @module MessageActions */

import * as actionTypes from "../ActionTypes";
import { addSnackbar } from "./SnackbarActions";

import { stageData } from "../../data/messageData";

/**
 * @function setStageInStore
 * @description increments stage in MessageState store
 * @param {Number} stage
 */
export const setStageInStore = stage => ({
  type: actionTypes.SET_STAGE,
  payload: stage
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
 * @function setStageInStore
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
  dispatch(setStageInStore(stage + 1));
};
