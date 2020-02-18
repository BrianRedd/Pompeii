/** @module CardsActions */

import { ADD_CARDS, ADD_DECK } from "../ActionTypes";
import { cardsData } from "../../data/cards";

/**
 * @function addCards
 * @description adds cards array to CardsState store
 * @param {Object} cards - cards dictionary
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
  dispatch(addCards(cardsData));
  dispatch(addDeck(Object.keys(cardsData)));
};
