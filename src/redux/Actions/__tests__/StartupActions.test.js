/** @module StartupActions.test */

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actionTypes from "../../ActionTypes";
import * as actions from "../StartupActions";

test("gameSetup", async () => {
  const expectedActions = [
    actionTypes.SET_PLAYERS_ARRAY,
    actionTypes.ADD_GRID,
    actionTypes.ADD_PLAYERS,
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
  await store.dispatch(actions.gameSetup()).then(() => {
    const theseActions = store.getActions().map(a => a.type);
    expect(theseActions).toEqual(expectedActions);
  });
});
