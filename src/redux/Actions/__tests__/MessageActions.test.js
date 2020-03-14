/** @module MessageActions.test */

import * as actionTypes from "../../ActionTypes";
import * as actions from "../MessageActions";

test("setStageInStore", () => {
  const payload = null;
  const expectedAction = {
    type: actionTypes.SET_STAGE,
    payload
  };
  expect(actions.setStageInStore(payload)).toEqual(expectedAction);
});

test("updateInstructions", () => {
  const payload = { text: "Test", color: "#FFFFFF" };
  const expectedAction = {
    type: actionTypes.UPDATE_INSTRUCTIONS,
    payload
  };
  expect(actions.updateInstructions(payload)).toEqual(expectedAction);
});
