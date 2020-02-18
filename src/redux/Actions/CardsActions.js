/** @module CardsActions */

import * as actions from "../ActionTypes";
import { cardsData } from "../../data/cards";
import { updatePlayerHand } from "./PlayersActions";

/**
 * @function addCards
 * @description adds cards dictionary to CardsState store
 * @param {Object} cards - cards dictionary
 */
export const addCards = cards => ({
  type: actions.ADD_CARDS,
  payload: cards
});

/**
 * @function addDeck
 * @description adds deck array to CardsState store
 * @param {Array} deck
 */
export const addDeck = deck => ({
  type: actions.ADD_DECK,
  payload: deck
});

/**
 * @function shuffleCards
 * @description shuffles any array of cards provided and returns randomized (using Fisher-Yates shuffle)
 * @param {Array} cards
 * @returns {Array}
 */
const shuffleCards = cards => {
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
  dispatch(addCards(cardsData));
  let deck = [];
  const omens = [];
  const ad79s = [];
  Object.keys(cardsData).forEach(card => {
    for (let i = 0; i < cardsData[card].count; i += 1) {
      switch (cardsData[card].type) {
        case "Omen":
          omens.push(card);
          break;
        case "AD79":
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

  // add AD79 to first 15 (2-3 players) cards

  deck.splice(Math.floor(Math.random(1) * 15), 0, ad79s.shift());

  deck = [...deck, ...ad79s, ...hands[5], ...hands[6]];

  dispatch(addDeck(deck));

  const promises = [];

  console.log("players:", players);
  players.forEach((player, idx) => {
    promises.push(dispatch(updatePlayerHand(player, hands[idx])));
  });

  Promise.all(promises);
};
