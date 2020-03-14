/** @module flags */

/**
 * @constant flagsList
 * @description Array of objects listing flags used throughout app, their
 * descriptions, and default states
 */
const flagsList = [
  {
    name: "placing-person",
    description: "In process of person placement",
    defaultState: false
  },
  {
    name: "card-wild",
    description: "If no location per card, are we placing anywhere",
    defaultState: false
  },
  {
    name: "card-omen",
    description: "Has omen card been drawn",
    defaultState: false
  },
  {
    name: "card-ad79",
    description: "Has AD79 card been drawn",
    defaultState: false
  },
  {
    name: "lava-tile",
    description: "Placing lava tile", // ?
    defaultState: false
  },
  {
    name: "wild-lava-tile",
    description: "Wild lava tile drawn",
    defaultState: false
  },
  {
    name: "placing-lava-tile",
    description: "Placing Lava tile", // ?
    defaultState: false
  },
  {
    name: "no-place-to-place",
    description: "Placing Lava tile",
    defaultState: false
  },
  {
    name: "game-over",
    description: "Game Over!",
    defaultState: false
  },
  {
    name: "game-stats",
    description: "Game Statistics",
    defaultState: false
  },
  {
    name: "game-start",
    description: "Start of Game Modal",
    defaultState: true
  }
];

export default flagsList;
