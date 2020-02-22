/** @module types */

import { arrayOf, number, object, string, shape } from "prop-types";

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
      hand: arrayOf(string),
      color: string
    })
  }),
  defaults: {
    player1: {
      name: "Player 1",
      hand: [],
      color: "#FFFFFF"
    }
  }
};

export const playersState = {
  types: shape({
    players: arrayOf(string),
    details: player.types,
    turn: number
  }),
  defaults: {
    players: ["player1"],
    details: player.defaults,
    turn: 0
  }
};

// grid types

export const occupant = {
  types: shape({
    player: string,
    gender: string
  })
};

export const gridSquare = {
  types: shape({
    buildingName: string,
    buildingCapacity: number,
    ventName: string,
    gateName: string,
    occupants: arrayOf(occupant.types)
  }),
  defaults: {
    buildingName: null,
    buildingCapacity: null,
    ventName: null,
    gateName: null,
    occupants: []
  }
};

export const grid = {
  types: shape({
    "0_0": gridSquare.types
  }),
  defaults: {
    "0_0": gridSquare.defaults
  }
};

// message types

export const messageState = {
  types: shape({
    stage: number,
    instruction: shape({
      text: string,
      color: string
    })
  }),
  defaults: {
    stage: 0,
    instruction: {
      text: "",
      color: ""
    }
  }
};
