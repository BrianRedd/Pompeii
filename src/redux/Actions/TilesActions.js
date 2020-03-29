/** @module TilesActions */

import * as actionTypes from "../ActionTypes";
import { tileDictionary, wildTileDictionary } from "../../data/tileData";
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
 * @function setLavaTile
 * @description set lava tile in store
 * @param {String} tile
 */
export const setLavaTile = tile => ({
  type: actionTypes.SET_LAVA_TILE,
  payload: tile
});

/**
 * @function generatePile
 * @description generates tile pile for game
 * @param {Boolean} wilds - are wild tiles includes
 */
export const generatePile = wilds => dispatch => {
  // pull tiles from tileDictionary
  let tiles = tileDictionary;
  if (wilds) {
    tiles = {
      ...tiles,
      ...wildTileDictionary
    }
  }
  dispatch(addTiles(tiles));

  // populate pile arrays
  let pile = [];
  Object.keys(tiles).forEach(tile => {
    for (let i = 0; i < tiles[tile].count; i += 1) {
      pile.push(tile);
    }
  });
  pile = shuffle(pile);
  dispatch(addTilePile(pile));
};
