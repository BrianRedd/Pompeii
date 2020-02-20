/** PlayersReducer.test */

import * as actionTypes from "../../ActionTypes";
import Reducer from "../PlayersReducer";
import * as types from "../../../types/types";

const defaultState = types.playersState.defaults;

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
  expect(state.details).toEqual({
    player1: { name: "Player 1", hand: ["card_1", "card_2"] }
  });
});

describe("should handle NEXT_PLAYER_TURN action", () => {
  test("0 -> 1", () => {
    const payload = null;
    const action = {
      type: actionTypes.NEXT_PLAYER_TURN,
      payload
    };
    const state = Reducer({ turn: 0, players: ["1", "2"] }, action);
    expect(state.turn).toEqual(1);
  });
  test("2 -> 0", () => {
    const payload = null;
    const action = {
      type: actionTypes.NEXT_PLAYER_TURN,
      payload
    };
    const state = Reducer({ turn: 2, players: ["1", "2", "3"] }, action);
    expect(state.turn).toEqual(0);
  });
});
