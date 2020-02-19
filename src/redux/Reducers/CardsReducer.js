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
    deck: [],
    discard: []
  },
  action
) => {
  const { type, payload } = action;
  let drawnCard = "";
  const tempDeck = state.deck;
  const tempDiscard = state.discard;
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
    case actions.DRAW_CARD:
      drawnCard = tempDeck.pop();
      tempDiscard.push(drawnCard);
      return {
        ...state,
        deck: tempDeck,
        discard: tempDiscard
      };
    default:
      return state;
  }
};

export default cardsState;
