/** @module PlayersReducer */

import * as actions from "../ActionTypes";

/**
 * @constant playersState
 * @param {Object} state - players state object
 * @param {Object} action
 */
const playersState = (
  state = {
    players: [],
    details: {}
  },
  action
) => {
  const { type, payload } = action;
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
            hand: payload.hand
          }
        }
      };
    default:
      return state;
  }
};

export default playersState;
