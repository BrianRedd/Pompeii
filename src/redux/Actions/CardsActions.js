/** @module CardsActions */

import * as actionTypes from "../ActionTypes";
import { cardDictionary } from "../../data/cardData";
import { updatePlayerHand } from "./PlayersActions";
import * as constant from "../../data/constants";

/**
 * @function addCards
 * @description adds cards dictionary to CardsState store
 * @param {Object} cards - cards dictionary
 */
export const addCards = cards => ({
  type: actionTypes.ADD_CARDS,
  payload: cards
});

/**
 * @function addDeck
 * @description adds deck array to CardsState store
 * @param {Array} deck
 */
export const addDeck = deck => ({
  type: actionTypes.ADD_DECK,
  payload: deck
});

/**
 * @function takeCard
 * @description takes top card from deck
 */
export const takeCard = () => ({
  type: actionTypes.TAKE_CARD,
  payload: null
});

/**
 * @function discardCard
 * @description places card into discard pile
 * @param {String} card
 */
export const discardCard = card => ({
  type: actionTypes.DISCARD_CARD,
  payload: card
});

/**
 * @function shuffleCards
 * @description shuffles any array of cards provided and returns randomized (using Fisher-Yates shuffle)
 * @param {Array} cards
 * @returns {Array}
 */
export const shuffleCards = cards => {
  const shuffledCards = [...cards];
  const numberOfShuffles = 5;
  for (let s = 0; s < numberOfShuffles; s += 1) {
    for (let i = shuffledCards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i]
      ];
    }
  }
  return shuffledCards;
};

/**
 * @function generateDeck
 * @description generates deck for game
 */
export const generateDeck = () => (dispatch, getState) => {
  const {
    playersState: { players }
  } = getState();

  // pull cards from cardDictionary
  dispatch(addCards(cardDictionary));

  // populate deck arrays
  let deck = [];
  const omens = [];
  const ad79s = [];
  Object.keys(cardDictionary).forEach(card => {
    for (let i = 0; i < cardDictionary[card].count; i += 1) {
      switch (cardDictionary[card].type) {
        case constant.OMEN:
          omens.push(card);
          break;
        case constant.AD79:
          ad79s.push(card);
          break;
        default:
          deck.push(card);
      }
    }
  });
  deck = shuffleCards(deck);

  // 7 hands of 4 cards each
  const hands = [];
  for (let i = 0; i < 7; i += 1) {
    hands.push([]);
    for (let ii = 0; ii < 4; ii += 1) {
      const hand = deck.shift();
      hands[i].push(hand);
    }
  }

  // add omens
  deck = shuffleCards([...deck, ...omens]);

  // add AD79 to first 10 (4 players) or 15 (2-3 players) cards
  const numberOfCards = players.length > 3 ? 10 : 15;
  deck.splice(Math.floor(Math.random(1) * numberOfCards), 0, ad79s.shift());

  // add two hands to end of deck
  deck = [...deck, ...ad79s, ...hands[5], ...hands[6]];
  dispatch(addDeck(deck));

  // pass hands to players
  const promises = [];
  players.forEach((player, idx) => {
    promises.push(dispatch(updatePlayerHand(player, hands[idx])));
  });
  Promise.all(promises);
};
