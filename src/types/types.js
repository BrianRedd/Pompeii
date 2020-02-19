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
    deck: deck.types,
    discard: deck.types
  }),
  defaults: {
    cards: cards.defaults,
    deck: deck.defaults,
    discard: deck.defaults
  }
};

// player types
export const player = {
  types: shape({
    player1: shape({
      name: string,
      hand: arrayOf(string)
    })
  }),
  defaults: {
    player1: {
      name: "Player 1",
      hand: []
    }
  }
};

export const playersState = {
  types: shape({
    players: arrayOf(string),
    details: player.types
  }),
  defaults: {
    players: ["player1"],
    details: player.details
  }
};
