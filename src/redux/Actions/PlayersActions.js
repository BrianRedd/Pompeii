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
 * @function setPlayerTurn
 * @description sets player turn in PlayersState store
 * @param {Number} player - whose turn it is
 */
export const setPlayerturn = player => ({
  type: actionTypes.SET_PLAYER_TURN,
  payload: player
});

export const incrementPlayerTurn = () => (dispatch, getState) => {
  const { playersState } = getState();
  let nextPlayer = playersState.turn + 1;
  if (nextPlayer >= playersState.players.length) {
    nextPlayer = 0;
  }
  dispatch(setPlayerturn(nextPlayer));
  dispatch(
    updateInstructions({
      text: `${_.get(
        playersState,
        `details.${playersState.players[nextPlayer]}.name`
      )}: ${constant.PLAY}`,
      color: _.get(
        playersState,
        `details.${playersState.players[nextPlayer]}.color`
      )
    })
  );
};
