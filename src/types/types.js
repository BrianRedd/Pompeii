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

/*
 CARD TYPES
 ----------*/

/**
 * @const cards
 * @description Types for cards Redux store
 */
export const cards = {
  types: shape({
    key: object
  }),
  defaults: {
    key: {}
  }
};

/**
 * @const deck
 * @description Types for deck Redux store
 */
export const deck = {
  types: arrayOf(string),
  defaults: []
};

/**
 * @const cardsState
 * @description Types for cardsState Redux store
 */
export const cardsState = {
  types: shape({
    cards: cards.types,
    deck: deck.types,
    discard: deck.types,
    grid: deck.types
  }),
  defaults: {
    cards: cards.defaults,
    deck: deck.defaults,
    discard: deck.defaults,
    grid: deck.defaults
  }
};

/*
 FLAG TYPES
 ----------*/

/**
 * @const flagsState
 * @description Types for flagsState Redux store
 */
export const flagsState = {
  types: shape({
    flags: arrayOf(string),
    runCount: number,
    relativesCount: number,
    eruptionCount: number
  }),
  defaults: {
    flags: [],
    runCount: 0,
    relativesCount: 0,
    eruptionCount: 0
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

/*
 GAME PLAY TYPES
 ---------------*/

/**
 * @const gamePlayState
 * @description Types for gamePlayState Redux store
 */
export const gamePlayState = {
  types: shape({
    gameSettings: shape({
      prePopulate: bool,
      startPhase: number,
      noEruption: bool,
      showStrategyValues: bool
    }),
    recommendations: arrayOf(
      shape({
        square: string,
        value: number
      })
    ),
    placedRelatives: arrayOf(string)
  }),
  defaults: {
    getSettings: {
      prePopulate: false,
      startPhase: 0,
      noEruption: false,
      showStrategyValues: false
    },
    recommendations: [],
    placedRelatives: []
  }
};

/*
 GRID TYPES
 ----------*/

/**
 * @const occupant
 * @description Types for occupant Redux store
 */
export const occupant = {
  types: shape({
    player: string,
    gender: string,
    lastMoved: number
  })
};

/**
 * @const gridSquare
 * @description Types for gridSquare Redux store
 */
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

/**
 * @const gridState
 * @description Types for gridState Redux store
 */
export const gridState = {
  types: shape({
    grid: shape({
      "0_0": gridSquare.types
    }),
    dangerZone: arrayOf(string)
  }),
  defaults: {
    grid: {
      "0_0": gridSquare.defaults
    },
    dangerZone: []
  }
};

/*
 MESSAGE TYPES
 -------------*/

/**
 * @const messageState
 * @description Types for messageState Redux store
 */
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

/*
 PLAYER TYPES
 ------------*/

/**
 * @const playerDetails
 * @description Types for playerDetails Redux store
 */
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
      name: "",
      hand: [],
      color: "#FFFFFF",
      casualties: 0,
      population: 0,
      saved: 0,
      ai: false
    }
  }
};

/**
 * @const playersState
 * @description Types for playersState Redux store
 */
export const playersState = {
  types: shape({
    players: arrayOf(string),
    details: playerDetails.types,
    activePlayer: string,
    turn: number,
    totalTurns: number
  }),
  defaults: {
    players: [""],
    details: playerDetails.defaults,
    activePlayer: "",
    turn: 0,
    totalTurns: 0
  }
};

/*
 TILE TYPES
 ----------*/

/**
 * @const tiles
 * @description Types for tiles Redux store
 */
export const tiles = {
  types: shape({
    key: object
  }),
  defaults: {
    key: {}
  }
};

/**
 * @const pile
 * @description Types for pile Redux store
 */
export const pile = {
  types: arrayOf(string),
  defaults: []
};

/**
 * @const tileState
 * @description Types for tileState Redux store
 */
export const tileState = {
  types: shape({
    tiles: tiles.types,
    pile: pile.types,
    lavaTile: string
  }),
  defaults: {
    tiles: tiles.defaults,
    pile: pile.defaults,
    lavaTile: ""
  }
};
