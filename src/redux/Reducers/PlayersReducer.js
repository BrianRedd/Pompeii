/** @module PlayersReducer */

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
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            population:
              state.details[payload.playerId].population + payload.population
          }
        }
      };
    case actions.INCREMENT_PLAYER_CASUALTIES:
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            population:
              state.details[payload.playerId].population - payload.casualties,
            casualties:
              state.details[payload.playerId].casualties + payload.casualties
          }
        }
      };
    case actions.INCREMENT_PLAYER_SAVED:
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            saved: state.details[payload.playerId].saved + payload.saved,
            population:
              state.details[payload.playerId].population - payload.saved
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
