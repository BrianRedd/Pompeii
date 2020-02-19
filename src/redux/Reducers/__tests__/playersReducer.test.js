/** PlayersReducer.test */

import * as actionTypes from "../../ActionTypes";
import Reducer from "../PlayersReducer";

const defaultState = {
  players: [],
  details: {}
};

test("should return initial state", () => {
  expect(Reducer(undefined, { type: "", payload: "" })).toEqual(defaultState);
});

test("should handle SET_PLAYERS_ARRAY action", () => {
  const payload = ["player1", "player2"];
  const action = {
    type: actionTypes.SET_PLAYERS_ARRAY,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.players).toEqual(payload);
});

test("should handle ADD_PLAYERS action", () => {
  const payload = { player1: { value: "test" } };
  const action = {
    type: actionTypes.ADD_PLAYERS,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.details).toEqual(payload);
});

test("should handle ADD_PLAYER action", () => {
  const payload = {
    playerId: "player1",
    details: {
      value: "test"
    }
  };
  const action = {
    type: actionTypes.ADD_PLAYER,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.details).toEqual({ player1: { value: "test" } });
});

test("should handle UPDATE_PLAYER_HAND action", () => {
  const payload = {
    playerId: "player1",
    hand: ["card_2", "card_1"]
  };
  const action = {
    type: actionTypes.UPDATE_PLAYER_HAND,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.details).toEqual({ player1: { hand: ["card_1", "card_2"] } });
});
