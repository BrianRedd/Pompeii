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
 * @function updateGridSquare
 * @description updates singular grid square within GridState store
 * @param {String} squareId - square Id
 * @param {Object} squareObj - square object (updating existing)
 */
export const updateGridSquare = (squareId, squareObj) => ({
  type: actionTypes.UPDATE_GRID_SQUARE,
  payload: { squareId, squareObj }
});
