/** @module TilesActions.test */

import * as actionTypes from "../../ActionTypes";
import * as actions from "../TilesActions";

test("addTiles", () => {
  const payload = {
    TEST: {
      value: "test"
    }
  };
  const expectedAction = {
    type: actionTypes.ADD_TILES,
    payload
  };
  expect(actions.addTiles(payload)).toEqual(expectedAction);
});

test("addTilePile", () => {
  const payload = ["test1", "test2"];
  const expectedAction = {
    type: actionTypes.ADD_TILE_PILE,
    payload
  };
  expect(actions.addTilePile(payload)).toEqual(expectedAction);
});

test("takeTile", () => {
  const expectedAction = {
    type: actionTypes.TAKE_TILE,
    payload: null
  };
  expect(actions.takeTile()).toEqual(expectedAction);
});
