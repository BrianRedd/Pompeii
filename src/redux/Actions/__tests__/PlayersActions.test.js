/** @module PlayersActions.test */

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actionTypes from "../../ActionTypes";
import * as actions from "../PlayersActions";
import * as constant from "../../../data/constants";

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

test("incrementPlayerPopulation", () => {
  const playerId = "player1";
  const personObj = { player: "player1", id: "1" };
  const expectedAction = {
    type: actionTypes.INCREMENT_PLAYER_POPULATION,
    payload: { playerId, personObj }
  };
  expect(actions.incrementPlayerPopulation(playerId, personObj)).toEqual(
    expectedAction
  );
});

test("incrementPlayerCasualtiesInStore", () => {
  const payload = { player: "player1", id: "1" };
  const expectedAction = {
    type: actionTypes.INCREMENT_PLAYER_CASUALTIES,
    payload
  };
  expect(actions.incrementPlayerCasualtiesInStore(payload)).toEqual(
    expectedAction
  );
});

test("incrementPlayerSavedInStore", () => {
  const payload = { player: "player1", id: "1" };
  const expectedAction = {
    type: actionTypes.INCREMENT_PLAYER_SAVED,
    payload
  };
  expect(actions.incrementPlayerSavedInStore(payload)).toEqual(expectedAction);
});

test("setPlayerTurn", () => {
  const payload = 1;
  const expectedAction = {
    type: actionTypes.SET_PLAYER_TURN,
    payload
  };
  expect(actions.setPlayerTurn(1)).toEqual(expectedAction);
});

describe("incrementPlayerTurn", () => {
  const initialState = {
    playersState: {
      players: ["player1", "player2"],
      details: {
        player1: {
          name: "Player 1",
          color: "#000000",
          population: [{ id: "1" }]
        },
        player2: {
          name: "Player 2",
          color: "#FFFFFF",
          population: [{ id: "1" }]
        }
      }
    },
    gridState: { grid: [] },
    messageState: { stage: 0 },
    tileState: { pile: [{ key: "value" }] }
  };
  test("0 -> 1", () => {
    const thisState = { ...initialState };
    thisState.playersState.turn = 0;
    const expectedActions = [
      {
        type: "SET_PLAYER_TURN",
        payload: 1
      },
      {
        type: "SET_ACTIVE_PLAYER",
        payload: "player2"
      },
      {
        type: "UPDATE_INSTRUCTIONS",
        payload: {
          text: `Player 2: ${constant.PLAY}`,
          color: "#FFFFFF"
        }
      }
    ];
    const store = configureMockStore([thunk])(thisState);
    store.dispatch(actions.incrementPlayerTurn());
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual(expectedActions);
  });
  test("1 -> 0", () => {
    const thisState = { ...initialState };
    thisState.playersState.turn = 1;
    const expectedActions = [
      {
        type: "SET_PLAYER_TURN",
        payload: 0
      },
      {
        type: "SET_ACTIVE_PLAYER",
        payload: "player1"
      },
      {
        type: "UPDATE_INSTRUCTIONS",
        payload: {
          text: `Player 1: ${constant.PLAY}`,
          color: "#000000"
        }
      }
    ];
    const store = configureMockStore([thunk])(thisState);
    store.dispatch(actions.incrementPlayerTurn());
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual(expectedActions);
  });
});
