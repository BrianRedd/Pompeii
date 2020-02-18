/** @module types */

import { string, shape, arrayOf, object } from "prop-types";

// card types
export const cards = {
  types: shape({
    key: object
  }),
  defaults: {
    key: {}
  }
};

export const deck = {
  types: arrayOf(string),
  defaults: []
};

export const cardsState = {
  types: shape({
    cards: cards.types,
    deck: deck.types
  }),
  defaults: {
    cards: cards.defaults,
    deck: deck.defaults
  }
};

// player types
export const playersState = {
  types: {
    players: arrayOf(string),
    details: shape({
      player1: shape({
        name: string,
        hand: arrayOf(string)
      })
    })
  },
  defaults: {
    players: ["player1"],
    details: {
      player1: {
        name: "Player 1",
        hand: []
      }
    }
  }
};
