/** @module PlayersActions */

import * as actionTypes from "../ActionTypes";

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
 * @function nextPlayerTurn
 * @description increment player turn in PlayersState store
 */
export const nextPlayerTurn = () => ({
  type: actionTypes.NEXT_PLAYER_TURN,
  payload: null
});
