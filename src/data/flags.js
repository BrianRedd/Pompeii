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
  }
];

export default flagsList;
