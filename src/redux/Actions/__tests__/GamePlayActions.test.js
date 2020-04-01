/** @module GamePlayActions.test */

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actionTypes from "../../ActionTypes";
import * as actions from "../GamePlayActions";

test("gameSetup", async () => {
  const expectedActions = [
    actionTypes.SAVE_GAME_SETTINGS,
    actionTypes.ADD_GRID,
    actionTypes.SET_ERUPTION_COUNTER,
    actionTypes.SET_PLAYERS_ARRAY,
    actionTypes.ADD_PLAYERS,
    actionTypes.SET_PLAYER_TURN,
    actionTypes.SET_ACTIVE_PLAYER,
    actionTypes.ADD_CARDS,
    actionTypes.ADD_DECK,
    actionTypes.UPDATE_PLAYER_HAND,
    actionTypes.ADD_TILES,
    actionTypes.ADD_TILE_PILE,
    actionTypes.UPDATE_INSTRUCTIONS
  ];
  const store = configureMockStore([thunk])({
    playersState: {
      players: ["player1"],
      details: { player1: { hand: [] } }
    }
  });
  const details = {
    player1: {
      name: "Player 1",
      hand: [],
      color: "0, 0, 0",
      casualties: 0,
      population: [],
      saved: 0,
      ai: false
    },
    player2: {
      name: "Player 2",
      hand: [],
      color: "0, 0, 0",
      casualties: 0,
      population: [],
      saved: 0,
      ai: true
    }
  };
  const startPlayer = 1;
  await store.dispatch(actions.gameSetup(details, startPlayer)).then(() => {
    const theseActions = store.getActions().map(a => a.type);
    expect(theseActions).toEqual(expectedActions);
  });
});
