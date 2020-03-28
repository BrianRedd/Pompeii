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

/**
 * @function placeLavaTileOnSquare
 * @description updates singular grid square within GridState store
 * with lava tile
 * @param {String} squareId - square Id
 * @param {Array} tile - lava tile
 */
export const placeLavaTileOnSquare = (squareId, tile) => ({
  type: actionTypes.PLACE_LAVA,
  payload: { squareId, tile }
});

/**
 * @function setDangerZone
 * @description updates gridState.dangerZone
 * @param {Array} zone - array of squares
 */
export const setDangerZone = zone => ({
  type: actionTypes.SET_DANGER_ZONE,
  payload: zone
});

/**
 * @function updateDistanceToExitInStore
 * @description updates square's shortest safe distance to exit
 * @param {String} squareId - square Id
 * @param {Number} distance - distance
 */
export const updateDistanceToExitInStore = (squareId, distance) => ({
  type: actionTypes.UPDATE_DISTANCE_TO_EXIT,
  payload: { squareId, distance }
});

/**
 * @function updateDistanceToExit
 * @description dispatch updated distance to action
 * @param {String} squareId - square Id
 * @param {Number} distance - distance
 */
export const updateDistanceToExit = (squareId, distance) => dispatch => {
  dispatch(updateDistanceToExitInStore(squareId, distance));
};
