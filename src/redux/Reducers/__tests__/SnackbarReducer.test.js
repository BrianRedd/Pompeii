/** @module SnackbarReducer.test */

import { ADD_SNACKBAR } from "../../ActionTypes";
import * as types from "../../../types/types";
import Reducer from "../SnackbarReducer";

const defaultState = types.snackbarState.defaults;

test("should return initial state", () => {
  expect(Reducer(undefined, { type: "", payload: "" })).toEqual(defaultState);
});

test("should handle ADD_SNACKBAR action", () => {
  const payload = {
    message: "message",
    type: "type"
  };
  const state = Reducer(undefined, {
    type: ADD_SNACKBAR,
    payload
  });
  expect(state.message).toBe(payload.message);
  expect(state.type).toBe(payload.type);
});
