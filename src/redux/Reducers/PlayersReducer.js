/** @module PlayersReducer */

import _ from "lodash";

import * as actions from "../ActionTypes";
import * as types from "../../types/types";
import { compareCards } from "../../utils/utilsCommon";

/**
 * @constant playersState
 * @param {Object} state - players state object
 * @param {Object} action
 */
const playersState = (state = types.playersState.defaults, action) => {
  const { type, payload } = action;
  let totalTurns;
  let populationArray = [];
  let casualtiesArray = [];
  let savedArray = [];
  const totalPieces = _.get(
    state,
    `details.${_.get(payload, "playerId", "null")}.totalPieces`,
    0
  );
  let idx;
  let playerId;
  let transitionObj;
  switch (type) {
    case actions.SET_PLAYERS_ARRAY:
      return {
        ...state,
        players: payload
      };
    case actions.ADD_PLAYERS:
      return {
        ...state,
        details: payload
      };
    case actions.ADD_PLAYER:
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: payload.details
        }
      };
    case actions.UPDATE_PLAYER_HAND:
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            hand: payload.hand.sort(compareCards)
          }
        }
      };
    case actions.INCREMENT_PLAYER_POPULATION:
      populationArray = _.get(
        state,
        `details.${payload.playerId}.population`,
        []
      );
      populationArray.push(payload.personObj);
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            population: populationArray,
            totalPieces: totalPieces + 1
          }
        }
      };
    case actions.INCREMENT_PLAYER_CASUALTIES:
      playerId = payload.player;
      populationArray = _.get(state, `details.${playerId}.population`, []);
      casualtiesArray = _.get(state, `details.${playerId}.casualties`, []);
      idx = populationArray.map(p => p.id).indexOf(payload.id);
      transitionObj = populationArray.splice(idx, 1);
      casualtiesArray.push(transitionObj[0]);
      return {
        ...state,
        details: {
          ...state.details,
          [playerId]: {
            ...state.details[playerId],
            casualties: casualtiesArray,
            population: populationArray
          }
        }
      };
    case actions.INCREMENT_PLAYER_SAVED:
      playerId = payload.player;
      populationArray = _.get(state, `details.${playerId}.population`, []);
      savedArray = _.get(state, `details.${playerId}.saved`, []);
      idx = populationArray.map(p => p.id).indexOf(payload.id);
      transitionObj = populationArray.splice(idx, 1);
      savedArray.push(transitionObj[0]);
      return {
        ...state,
        details: {
          ...state.details,
          [playerId]: {
            ...state.details[playerId],
            saved: savedArray,
            population: populationArray
          }
        }
      };
    case actions.SET_PLAYER_TURN:
      totalTurns = state.totalTurns + 1;
      return {
        ...state,
        turn: payload,
        totalTurns
      };
    case actions.SET_ACTIVE_PLAYER:
      return {
        ...state,
        activePlayer: payload
      };
    default:
      return state;
  }
};

export default playersState;
