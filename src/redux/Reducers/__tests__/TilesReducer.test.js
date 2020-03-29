/** TilesReducer.test */

import * as actionTypes from "../../ActionTypes";
import * as types from "../../../types/types";
import Reducer from "../TilesReducer";

const defaultState = types.tileState.defaults;

test("should return initial state", () => {
  expect(Reducer(undefined, { type: "", payload: "" })).toEqual(defaultState);
});

test("should handle ADD_TILES action", () => {
  const payload = {
    Tile1: {
      value: "test"
    }
  };
  const action = {
    type: actionTypes.ADD_TILES,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.tiles).toEqual(payload);
});

test("should handle ADD_TILE_PILE action", () => {
  const payload = ["Tile1", "Tile2"];
  const action = {
    type: actionTypes.ADD_TILE_PILE,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.pile).toEqual(payload);
});

test("should handle TAKE_TILE action", () => {
  const action = {
    type: actionTypes.TAKE_TILE,
    payload: null
  };
  const state = Reducer({ pile: ["Tile1", "Tile2"] }, action);
  expect(state.pile).toEqual(["Tile1"]);
});
