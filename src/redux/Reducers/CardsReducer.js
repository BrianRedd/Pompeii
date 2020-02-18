/** @module CardsReducer */

import { ADD_CARDS, ADD_DECK } from "../ActionTypes";

/**
 * @constant cardsState
 * @param {Object} state - cards state object
 * @param {Object} action
 */
const cardsState = (
  state = {
    cards: {},
    deck: []
  },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_CARDS:
      return {
        ...state,
        cards: payload
      };
    case ADD_DECK:
      return {
        ...state,
        deck: payload
      };
    default:
      return state;
  }
};

export default cardsState;
