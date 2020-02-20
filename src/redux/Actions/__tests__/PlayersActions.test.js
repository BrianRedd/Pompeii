/** @module PlayersActions.test */

import * as actionTypes from "../../ActionTypes";
import * as actions from "../PlayersActions";

test("setPlayerArray", () => {
  const payload = ["player1", "player2"];
  const expectedAction = {
    type: actionTypes.SET_PLAYERS_ARRAY,
    payload
  };
  expect(actions.setPlayerArray(payload)).toEqual(expectedAction);
});

test("addPlayers", () => {
  const payload = [
    {
      player1: {
        value: "test"
      }
    },
    {
      player2: {
        value: "test2"
      }
    }
  ];
  const expectedAction = {
    type: actionTypes.ADD_PLAYERS,
    payload
  };
  expect(actions.addPlayers(payload)).toEqual(expectedAction);
});

test("addPlayer", () => {
  const playerId = "player1";
  const details = {
    value: "test"
  };
  const expectedAction = {
    type: actionTypes.ADD_PLAYER,
    payload: { playerId, details }
  };
  expect(actions.addPlayer(playerId, details)).toEqual(expectedAction);
});

test("updatePlayerHand", () => {
  const playerId = "player1";
  const hand = ["CARD1", "CARD2"];
  const expectedAction = {
    type: actionTypes.UPDATE_PLAYER_HAND,
    payload: {
      playerId,
      hand
    }
  };
  expect(actions.updatePlayerHand(playerId, hand)).toEqual(expectedAction);
});

test("nextPlayerTurn", () => {
  const expectedAction = {
    type: actionTypes.NEXT_PLAYER_TURN,
    payload: null
  };
  expect(actions.nextPlayerTurn()).toEqual(expectedAction);
});
