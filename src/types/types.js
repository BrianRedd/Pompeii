/** @module types */

import {
  arrayOf,
  bool,
  number,
  object,
  oneOf,
  string,
  shape
} from "prop-types";

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
export const playerDetails = {
  types: shape({
    player1: shape({
      name: string,
      hand: arrayOf(string),
      color: string,
      casualties: number,
      population: number,
      saved: number,
      ai: bool
    })
  }),
  defaults: {
    player1: {
      name: "Player 1",
      hand: [],
      color: "#FFFFFF",
      casualties: 0,
      population: 0,
      saved: 0,
      ai: false
    }
  }
};

export const playersState = {
  types: shape({
    players: arrayOf(string),
    details: playerDetails.types,
    turn: number,
    totalTurns: number
  }),
  defaults: {
    players: ["player1"],
    details: playerDetails.defaults,
    turn: 0,
    totalTurns: 0
  }
};

// grid types

export const occupant = {
  types: shape({
    player: string,
    gender: string,
    lastMoved: number
  })
};

export const gridSquare = {
  types: shape({
    buildingName: string,
    buildingCapacity: number,
    ventName: string,
    gateName: string,
    occupants: arrayOf(occupant.types),
    offSets: arrayOf(arrayOf(number)),
    distanceToExit: number
  }),
  defaults: {
    buildingName: null,
    buildingCapacity: null,
    ventName: null,
    gateName: null,
    occupants: [],
    offSets: [],
    distanceToExit: 0
  }
};

export const gridState = {
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

// tile types
export const tiles = {
  types: shape({
    key: object
  }),
  defaults: {
    key: {}
  }
};

export const pile = {
  types: arrayOf(string),
  defaults: []
};

export const tileState = {
  types: shape({
    tiles: tiles.types,
    pile: pile.types
  }),
  defaults: {
    tiles: tiles.defaults,
    pile: pile.defaults
  }
};

// flags types

export const flagsState = {
  types: shape({
    flags: arrayOf(string),
    runCounter: number,
    relativesCounter: number
  }),
  defaults: {
    flags: [],
    runCounter: 0,
    relativesCounter: 0
  }
};

/**
 * @const snackbarState
 * @description Types for snackbarState Redux store
 */
export const snackbarState = {
  types: shape({
    message: string,
    type: oneOf(["info", "warning", "default", "error", "success"])
  }),
  defaults: {
    message: null,
    type: "default"
  }
};

// game play actions (recommended actions, etc)\

/**
 * @const gamePlayState
 * @description Types for gamePlayState Redux store
 */
export const gamePlayState = {
  types: shape({
    recommendations: arrayOf(
      shape({
        square: string,
        value: number
      })
    )
  }),
  defaults: {
    recommendations: []
  }
};
