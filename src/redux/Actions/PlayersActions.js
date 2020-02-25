/** @module PlayersActions */

import _ from "lodash";

import * as actionTypes from "../ActionTypes";
import * as constant from "../../data/constants";
import { updateInstructions } from "./MessageActions";

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
 * @function incrementPlayerCasualties
 * @description adds/updates single player casualties to PlayersState store
 * @param {String} playerId
 * @param {Object} casualties - player casualties increase
 */
export const incrementPlayerCasualties = (playerId, casualties) => ({
  type: actionTypes.INCREMENT_PLAYER_CASUALTIES,
  payload: { playerId, casualties }
});

/**
 * @function incrementPlayerSaved
 * @description adds/updates single player saved to PlayersState store
 * @param {String} playerId
 * @param {Object} saved - player saved increase
 */
export const incrementPlayerSaved = (playerId, saved) => ({
  type: actionTypes.INCREMENT_PLAYER_SAVED,
  payload: { playerId, saved }
});

/**
 * @function setPlayerTurn
 * @description sets player turn in PlayersState store
 * @param {Number} player - whose turn it is
 */
export const setPlayerturn = player => ({
  type: actionTypes.SET_PLAYER_TURN,
  payload: player
});

export const incrementPlayerTurn = () => (dispatch, getState) => {
  const {
    playersState,
    messageState: { stage }
  } = getState();
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
};
