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
  let nextTurn = state.turn + 1;
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
    case actions.NEXT_PLAYER_TURN:
      if (nextTurn >= state.players.length) {
        nextTurn = 0;
      }
      return {
        ...state,
        turn: nextTurn
      };
    default:
      return state;
  }
};

export default playersState;
