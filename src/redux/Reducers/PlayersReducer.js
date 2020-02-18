/** @module PlayersReducer */

import * as actions from "../ActionTypes";

const compareCards = (a, b) => {
  const cardA = parseFloat(a.split("_")[1]);
  const cardB = parseFloat(b.split("_")[1]);
  if (cardA === cardB) {
    return 0;
  }
  return cardA < cardB ? -1 : 1;
};

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
            hand: payload.hand.sort(compareCards)
          }
        }
      };
    default:
      return state;
  }
};

export default playersState;
