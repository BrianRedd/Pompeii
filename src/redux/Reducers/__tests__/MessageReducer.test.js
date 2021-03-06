/** @module MessageReducer.test */

import * as actionTypes from "../../ActionTypes";
import Reducer from "../MessageReducer";
import * as types from "../../../types/types";

const defaultState = types.messageState.defaults;

test("should return initial state", () => {
  expect(Reducer(undefined, { type: "", payload: "" })).toEqual(defaultState);
});

test("should handle SET_STAGE action", () => {
  const payload = null;
  const action = {
    type: actionTypes.SET_STAGE,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.stage).toEqual(null);
});

test("should handle UPDATE_INSTRUCTIONS action", () => {
  const payload = { text: "Test Instructions", color: "#FFFFFF" };
  const action = {
    type: actionTypes.UPDATE_INSTRUCTIONS,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.instruction).toEqual(payload);
});
