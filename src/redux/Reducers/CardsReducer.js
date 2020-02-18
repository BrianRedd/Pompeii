/** @module CardsReducer */

import * as actions from "../ActionTypes";

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
    default:
      return state;
  }
};

export default cardsState;
