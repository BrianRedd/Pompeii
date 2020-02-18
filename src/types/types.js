/** @module types */

import { string, shape, arrayOf, object } from "prop-types";

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
