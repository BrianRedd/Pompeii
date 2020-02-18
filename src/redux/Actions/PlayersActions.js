/** @module PlayersActions */

import * as actions from "../ActionTypes";

/**
 * @function setPlayerArray
 * @description adds players array to PlayersState store
 * @param {Array} playerIds - array of player IDs
 */
export const setPlayerArray = playerIds => ({
  type: actions.SET_PLAYERS_ARRAY,
  payload: playerIds
});

/**
 * @function addPlayers
 * @description adds all player object to PlayersState store
 * @param {Array} playersObj
 */
export const addPlayers = playersObj => ({
  type: actions.ADD_PLAYERS,
  payload: playersObj
});

/**
 * @function addPlayer
 * @description adds/updates single player object to PlayersState store
 * @param {String} playerId
 * @param {Object} details - player object
 */
export const addPlayer = (playerId, details) => ({
  type: actions.ADD_PLAYER,
  payload: { playerId, details }
});

/**
 * @function updatePlayerHand
 * @description adds/updates single player hand array to PlayersState store
 * @param {String} playerId
 * @param {Object} hand - player hand array
 */
export const updatePlayerHand = (playerId, hand) => ({
  type: actions.UPDATE_PLAYER_HAND,
  payload: { playerId, hand }
});
