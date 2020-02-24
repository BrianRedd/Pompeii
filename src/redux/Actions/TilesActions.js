/** @module TilesActions */

import * as actionTypes from "../ActionTypes";
import { tileDictionary } from "../../data/tileData";
import { shuffle } from "../../utils/utilsCommon";

/**
 * @function addTiles
 * @description adds tiles dictionary to TileState store
 * @param {Object} tiles - tiles dictionary
 */
export const addTiles = tiles => ({
  type: actionTypes.ADD_TILES,
  payload: tiles
});

/**
 * @function addTilePile
 * @description adds pile array to TileState store
 * @param {Array} pile
 */
export const addTilePile = pile => ({
  type: actionTypes.ADD_TILE_PILE,
  payload: pile
});

/**
 * @function takeTile
 * @description takes top tile from pile
 */
export const takeTile = () => ({
  type: actionTypes.TAKE_TILE,
  payload: null
});

/**
 * @function generatePile
 * @description generates tile pile for game
 */
export const generatePile = () => dispatch => {
  // pull tiles from tileDictionary
  dispatch(addTiles(tileDictionary));

  // populate pile arrays
  let pile = [];
  Object.keys(tileDictionary).forEach(tile => {
    for (let i = 0; i < tileDictionary[tile].count; i += 1) {
      pile.push(tile);
    }
  });
  pile = shuffle(pile);
  dispatch(addTilePile(pile));
};
