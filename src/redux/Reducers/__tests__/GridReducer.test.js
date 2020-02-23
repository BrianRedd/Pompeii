/** GridReducer.test */

import * as actionTypes from "../../ActionTypes";
import * as types from "../../../types/types";
import Reducer from "../GridReducer";

const defaultState = {
  grid: types.gridState.defaults
};

test("should return initial state", () => {
  expect(Reducer(undefined, { type: "", payload: "" })).toEqual(defaultState);
});

test("should handle ADD_GRID action", () => {
  const payload = {
    "0_0": {
      buildingName: null,
      occupants: []
    },
    "1_0": {
      buildingName: "Grey 1",
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

test("should handle PLACE_PEOPLE action", () => {
  const payload = {
    squareId: "0_0",
    occupants: [{ player: "tester", gender: "neuter" }]
  };
  const action = {
    type: actionTypes.PLACE_PEOPLE,
    payload
  };
  const state = Reducer(defaultState, action);
  expect(state.grid).toEqual({
    "0_0": {
      buildingName: null,
      buildingCapacity: null,
      occupants: [{ gender: "neuter", player: "tester" }],
      ventName: null,
      gateName: null
    }
  });
});
