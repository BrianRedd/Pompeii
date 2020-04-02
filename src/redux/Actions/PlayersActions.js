/** @module PlayersActions */

import _ from "lodash";

import * as actionTypes from "../ActionTypes";
import * as constant from "../../data/constants";
import { updateInstructions } from "./MessageActions";
import { addSnackbar } from "./SnackbarActions";
import { toggleFlags } from "./FlagsActions";
import { placeLavaTileOnSquare, placePeopleInSquare } from "./GridActions";

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
 * @param {Object} personObj - person
 */
export const incrementPlayerPopulation = (playerId, personObj) => ({
  type: actionTypes.INCREMENT_PLAYER_POPULATION,
  payload: { playerId, personObj }
});

/**
 * @function incrementPlayerCasualtiesInStore
 * @description adds/updates single player casualties to PlayersState store
 * @param {String} playerId
 * @param {Number} personObj - player casualty
 */
export const incrementPlayerCasualtiesInStore = (playerId, personObj) => ({
  type: actionTypes.INCREMENT_PLAYER_CASUALTIES,
  payload: { playerId, personObj }
});

/**
 * @function addActivePlayer
 * @description updates active player in PlayersState store
 * @param {String} playerId
 */
export const addActivePlayer = playerId => ({
  type: actionTypes.SET_ACTIVE_PLAYER,
  payload: playerId
});

/**
 * @function incrementPlayerCasualties
 * @description adds/updates single player casualties with snackbar
 * @param {String} playerId
 * @param {Object} personObj - player casualty
 */
export const incrementPlayerCasualties = (playerId, personObj) => (
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
  dispatch(incrementPlayerCasualtiesInStore(playerId, personObj));
};

/**
 * @function incrementPlayerSavedInStore
 * @description adds/updates single player saved to PlayersState store
 * @param {String} playerId
 * @param {Object} personObj - saved person
 */
export const incrementPlayerSavedInStore = (playerId, personObj) => ({
  type: actionTypes.INCREMENT_PLAYER_SAVED,
  payload: { playerId, personObj }
});

/**
 * @function incrementPlayerSaved
 * @description adds/updates single player saved with snackbar
 * @param {String} playerId
 * @param {Number} personObj - saved person
 */
export const incrementPlayerSaved = (playerId, personObj) => (
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
  dispatch(incrementPlayerSavedInStore(playerId, personObj));
};

/**
 * @function setPlayerTurn
 * @description sets player turn in PlayersState store
 * @param {Number} player - whose turn it is
 */
export const setPlayerTurn = player => ({
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
  const census = [];
  Object.values(playersState.details).forEach(arr => {
    census.concat(arr.population);
  });
  if (
    pile.length === // TODO
    0 /* ||
    _.sum(
      Object.values(playersState.details).map(arr => arr.population.length)
    ) === 0 */
  ) {
    const gridArray = Object.keys(grid);
    gridArray.forEach(square => {
      if (_.get(grid, `${square}.occupants.length`) > 0) {
        _.get(grid, `${square}.occupants`).forEach(person => {
          dispatch(incrementPlayerCasualtiesInStore(person.player, 1));
        });
      }
      if (!_.get(grid, `${square}.lava`)) {
        dispatch(placeLavaTileOnSquare(square, "Lava"));
      }
      dispatch(placePeopleInSquare(square, []));
    });
    dispatch(toggleFlags("game-over"));
  }

  // get next player
  const nextPlayer = (playersState.turn + 1) % playersState.players.length;
  dispatch(setPlayerTurn(nextPlayer));
  dispatch(addActivePlayer(playersState.players[nextPlayer]));
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
