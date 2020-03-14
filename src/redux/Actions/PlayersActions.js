/** @module PlayersActions */

import _ from "lodash";

import * as actionTypes from "../ActionTypes";
import * as constant from "../../data/constants";
import { updateInstructions } from "./MessageActions";
import { addSnackbar } from "./SnackbarActions";
import { toggleFlags } from "./FlagsActions";

/**
 * @function setPlayerArray
 * @description adds players array to PlayersState store
 * @param {Array} playerIds - array of player IDs
 */
export const setPlayerArray = playerIds => ({
  type: actionTypes.SET_PLAYERS_ARRAY,
  payload: playerIds
});

/**
 * @function addPlayers
 * @description adds all player object to PlayersState store
 * @param {Array} playersObj
 */
export const addPlayers = playersObj => ({
  type: actionTypes.ADD_PLAYERS,
  payload: playersObj
});

/**
 * @function addPlayer
 * @description adds/updates single player object to PlayersState store
 * @param {String} playerId
 * @param {Object} details - player object
 */
export const addPlayer = (playerId, details) => ({
  type: actionTypes.ADD_PLAYER,
  payload: { playerId, details }
});

/**
 * @function updatePlayerHand
 * @description adds/updates single player hand array to PlayersState store
 * @param {String} playerId
 * @param {Object} hand - player hand array
 */
export const updatePlayerHand = (playerId, hand) => ({
  type: actionTypes.UPDATE_PLAYER_HAND,
  payload: { playerId, hand }
});

/**
 * @function incrementPlayerPopulation
 * @description adds/updates single player population to PlayersState store
 * @param {String} playerId
 * @param {Object} population - player population increase
 */
export const incrementPlayerPopulation = (playerId, population) => ({
  type: actionTypes.INCREMENT_PLAYER_POPULATION,
  payload: { playerId, population }
});

/**
 * @function incrementPlayerCasualtiesInStore
 * @description adds/updates single player casualties to PlayersState store
 * @param {String} playerId
 * @param {Number} casualties - player casualties increase
 */
export const incrementPlayerCasualtiesInStore = (playerId, casualties) => ({
  type: actionTypes.INCREMENT_PLAYER_CASUALTIES,
  payload: { playerId, casualties }
});

/**
 * @function incrementPlayerCasualties
 * @description adds/updates single player casualties with snackbar
 * @param {String} playerId
 * @param {Number} casualties - player casualties increase
 */
export const incrementPlayerCasualties = (playerId, casualties) => (
  dispatch,
  getState
) => {
  const { playersState } = getState();
  setTimeout(() => {
    dispatch(
      addSnackbar({
        message: `${playersState.details[playerId].name}'s people have suffered casualties!`,
        type: "error"
      })
    );
  }, 10);
  dispatch(incrementPlayerCasualtiesInStore(playerId, casualties));
};

/**
 * @function incrementPlayerSavedInStore
 * @description adds/updates single player saved to PlayersState store
 * @param {String} playerId
 * @param {Object} saved - player saved increase
 */
export const incrementPlayerSavedInStore = (playerId, saved) => ({
  type: actionTypes.INCREMENT_PLAYER_SAVED,
  payload: { playerId, saved }
});

/**
 * @function incrementPlayerSaved
 * @description adds/updates single player saved with snackbar
 * @param {String} playerId
 * @param {Number} saved - player saved increase
 */
export const incrementPlayerSaved = (playerId, saved) => (
  dispatch,
  getState
) => {
  const { playersState } = getState();
  setTimeout(() => {
    dispatch(
      addSnackbar({
        message: `One of ${playersState.details[playerId].name}'s people have escaped!`,
        type: "success"
      })
    );
  }, 10);
  dispatch(incrementPlayerSavedInStore(playerId, saved));
};

/**
 * @function setPlayerTurn
 * @description sets player turn in PlayersState store
 * @param {Number} player - whose turn it is
 */
export const setPlayerturn = player => ({
  type: actionTypes.SET_PLAYER_TURN,
  payload: player
});

/**
 * @function incrementPlayerTurn
 * @description update player turn to next player (and check for end of game)
 */
export const incrementPlayerTurn = () => (dispatch, getState) => {
  const {
    playersState,
    messageState: { stage },
    tileState: { pile },
    gridState: { grid }
  } = getState();

  // game over?
  // out of tiles
  // no people left on board
  if (
    pile.length === 0 ||
    _.sum(Object.values(playersState.details).map(arr => arr.population)) === 0
  ) {
    const gridArray = Object.keys(grid);
    gridArray.forEach(square => {
      if (_.get(square, "occupants.length") > 0) {
        square.occupants.forEach(person => {
          incrementPlayerCasualties(person.player, 1);
        });
      }
    });
    dispatch(toggleFlags("game-over"));
  }

  // get next player
  const nextPlayer = (playersState.turn + 1) % playersState.players.length;
  dispatch(setPlayerturn(nextPlayer));
  dispatch(
    updateInstructions({
      text: `${_.get(
        playersState,
        `details.${playersState.players[nextPlayer]}.name`
      )}: ${stage < 2 ? constant.PLAY : constant.LAVA_TILE}`,
      color: _.get(
        playersState,
        `details.${playersState.players[nextPlayer]}.color`
      )
    })
  );
  dispatch(
    addSnackbar({
      message: `It is now ${_.get(
        playersState,
        `details.${playersState.players[nextPlayer]}.name`
      )}'s turn`,
      type: "info"
    })
  );
};
