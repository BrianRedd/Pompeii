/** @module FlagsReducer.test */

import * as actionTypes from "../../ActionTypes";
import Reducer from "../FlagsReducer";
import * as types from "../../../types/types";
import flagsList from "../../../data/flags";

const defaultFlags = flagsList.filter(t => t.defaultState).map(t => t.name);
const defaultState = { ...types.flagsState.defaults, flags: defaultFlags };

test("should return initial state", () => {
  expect(Reducer(undefined, { type: "", payload: "" })).toEqual(defaultState);
});

describe("should handle TOGGLE_FLAG action", () => {
  test("if the toggle is off, turn it on", () => {
    const payload = "test";
    const action = {
      type: actionTypes.TOGGLE_FLAGS,
      payload
    };
    const state = Reducer({ flags: [] }, action);
    expect(state.flags.includes("test")).toBe(true);
  });

  test("if the toggle is on, turn it off", () => {
    const payload = "test";
    const action = {
      type: actionTypes.TOGGLE_FLAGS,
      payload
    };
    const state = Reducer({ flags: ["test"] }, action);
    expect(state.flags.includes("test")).toBe(false);
  });

  test("turn off toggle regardless of index in array", () => {
    const payload = "test";
    const action = {
      type: actionTypes.TOGGLE_FLAGS,
      payload
    };
    const state = Reducer({ flags: ["a", "b", "test", "c"] }, action);
    expect(state.flags).toHaveLength(3);
    expect(state.flags.includes("test")).toBe(false);
  });

  test("turn on toggle regardless of index in array", () => {
    const payload = "test";
    const action = {
      type: actionTypes.TOGGLE_FLAGS,
      payload
    };
    const state = Reducer({ flags: ["a", "b", "c"] }, action);
    expect(state.flags).toHaveLength(4);
    expect(state.flags.includes("test")).toBe(true);
  });
});

test("should handle SET_RUN_COUNTER action", () => {
  const payload = 1;
  const action = {
    type: actionTypes.SET_RUN_COUNTER,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.runCount).toEqual(payload);
});
