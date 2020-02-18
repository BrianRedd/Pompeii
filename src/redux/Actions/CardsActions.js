/** @module CardsActions */

import { ADD_CARDS, ADD_DECK } from "../ActionTypes";

/**
 * @function addCards
 * @description adds cards array to CardsState store
 * @param {Array} cards
 */
export const addCards = cards => ({
  type: ADD_CARDS,
  payload: cards
});

/**
 * @function addDeck
 * @description adds deck array to CardsState store
 * @param {Array} deck
 */
export const addDeck = deck => ({
  type: ADD_DECK,
  payload: deck
});

export const generateDeck = () => dispatch => {
  dispatch(addCards([{ card: "test" }]));
};
