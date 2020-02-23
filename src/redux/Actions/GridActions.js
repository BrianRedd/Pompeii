/** @module CardsActions */

import * as actionTypes from "../ActionTypes";

/**
 * @function addGrid
 * @description adds initial grid to GridState store
 * @param {Object} cards - cards dictionary
 */
export const addGrid = grid => ({
  type: actionTypes.ADD_GRID,
  payload: grid
});

/**
 * @function placePeopleInSquare
 * @description updates singular grid square within GridState store
 * with updated occupants (replacing existing)
 * @param {String} squareId - square Id
 * @param {Array} occupants - occupants array
 */
export const placePeopleInSquare = (squareId, occupants) => ({
  type: actionTypes.PLACE_PEOPLE,
  payload: { squareId, occupants }
});
