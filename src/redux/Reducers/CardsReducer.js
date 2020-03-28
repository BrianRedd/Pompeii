/** @module CardsReducer */

import * as actions from "../ActionTypes";
import * as types from "../../types/types";

/**
 * @constant cardsState
 * @param {Object} state - cards state object
 * @param {Object} action
 */
const cardsState = (state = types.cardsState.defaults, action) => {
  const { type, payload } = action;
  switch (type) {
    case actions.ADD_CARDS:
      return {
        ...state,
        cards: payload
      };
    case actions.ADD_DECK:
      return {
        ...state,
        deck: payload
      };
    case actions.TAKE_CARD:
      return {
        ...state,
        deck: state.deck.slice(0, -1)
      };
    case actions.DISCARD_CARD:
      return {
        ...state,
        discard: [...state.discard, payload]
      };
    case actions.SET_CARD_GRID:
      return {
        ...state,
        grid: payload
      };
    default:
      return state;
  }
};

export default cardsState;
