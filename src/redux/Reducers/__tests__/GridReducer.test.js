/** GridReducer.test */

import * as actionTypes from "../../ActionTypes";
import * as types from "../../../types/types";
import Reducer from "../GridReducer";

const defaultState = {
  grid: types.grid.defaults
};

test("should return initial state", () => {
  expect(Reducer(undefined, { type: "", payload: "" })).toEqual(defaultState);
});

test("should handle ADD_GRID action", () => {
  const payload = {
    "0_0": {
      buildingColor: null,
      buildingNumber: null,
      occupants: []
    },
    "1_0": {
      buildingColor: "Grey",
      buildingNumber: 1,
      occupants: []
    }
  };
  const action = {
    type: actionTypes.ADD_GRID,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.grid).toEqual(payload);
});

test("should handle UPDATE_GRID_SQUARE action", () => {
  const payload = {
    squareId: "0_0",
    squareObj: { occupants: [{ player: "tester", gender: "neuter" }] }
  };
  const action = {
    type: actionTypes.UPDATE_GRID_SQUARE,
    payload
  };
  const state = Reducer(defaultState, action);
  expect(state.grid).toEqual({
    "0_0": {
      buildingColor: null,
      buildingNumber: null,
      occupants: [{ player: "tester", gender: "neuter" }]
    }
  });
});
