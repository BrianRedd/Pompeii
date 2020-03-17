/** @module helperFunctions */

import _ from "lodash";

import store from "../../redux/configureStore";

import {
  voidLavaSquares,
  voidRunSquares,
  gateSquares
} from "../../data/gridData";

/**
 * @function vacancy
 * @description checks for vacancy within a square
 * @param {String} square
 * @return {Boolean}
 */
export const vacancy = square => {
  console.log("vacancy; square:", square);
  const { gridState } = store.getState();
  if (
    _.get(gridState, `grid.${square}.occupants.length`, 0) <
    _.get(gridState, `grid.${square}.buildingCapacity`, 0)
  ) {
    return true;
  }
  return false;
};

/**
 * @function surroundByLavaDFS
 * @description DFS helper function to check for surrounded by lava
 * @param {Array} grid
 * @param {Number} x
 * @param {Number} y
 */
const surroundByLavaDFS = (grid, x, y) => {
  const thisGrid = [...grid];
  if (x > thisGrid.length - 1 || x < 0 || y > thisGrid[0].length || y < 0)
    return;

  if (thisGrid[x][y] === "O") thisGrid[x][y] = "*";

  if (x > 0 && thisGrid[x - 1][y] === "O") {
    surroundByLavaDFS(thisGrid, x - 1, y);
  }

  if (x < thisGrid.length - 1 && thisGrid[x + 1][y] === "O") {
    surroundByLavaDFS(thisGrid, x + 1, y);
  }

  if (y > 0 && thisGrid[x][y - 1] === "O") {
    surroundByLavaDFS(thisGrid, x, y - 1);
  }

  if (x < thisGrid[0].length - 1 && thisGrid[x][y + 1] === "O") {
    surroundByLavaDFS(thisGrid, x, y + 1);
  }
};

/**
 * @function checkForSurroundedTiles
 * @description DFS-based check for tiles surrounded by lava
 * @param {String} tile most recently placed tile location
 * @returns {Array} array of surrounded tiles
 */
export const checkForSurroundedTiles = tile => {
  console.log("checkForSurroundedTiles");
  const { gridState } = store.getState();
  const surroundedTiles = [];
  const tempGrid = [];
  for (let x = 0; x < 7; x += 1) {
    const row = [];
    for (let y = 0; y < 11; y += 1) {
      let gridValue = _.get(gridState, `grid.${x}_${y}.lava`) ? "L" : "O";
      if (tile === `${x}_${y}`) gridValue = "L";
      if (voidLavaSquares.includes(`${x}_${y}`)) {
        gridValue = "W";
      }
      if (gridValue === "O" && gateSquares.includes(`${x}_${y}`)) {
        gridValue = "X";
      }
      row.push(gridValue);
    }
    tempGrid.push(row);
  }

  const rows = tempGrid.length;
  const columns = tempGrid[0].length;

  gateSquares.forEach(square => {
    const coords = square.split("_");
    const x = parseFloat(coords[0]);
    const y = parseFloat(coords[1]);

    if (tempGrid[x][y] === "X") surroundByLavaDFS(tempGrid, x, y);
  });

  for (let x = 0; x < rows; x += 1) {
    for (let y = 0; y < columns; y += 1) {
      if (tempGrid[x][y] === "O") {
        tempGrid[x][y] = "L";
        surroundedTiles.push(`${x}_${y}`);
      } else if (tempGrid[x][y] === "*") {
        tempGrid[x][y] = "O";
      }
    }
  }
  return surroundedTiles;
};

let grid = [];

/**
 * @function runToDFS
 * @description recursive DFS helper function to determine run zone
 * @param {Number} x
 * @param {Number} y
 * @param {Number} distance
 */
export const runToDFS = (x, y, distance) => {
  const { gridState } = store.getState();
  const square = `${x}_${y}`;
  if (
    distance > 0 &&
    x > -2 &&
    x < 8 &&
    y > -2 &&
    y < 12 &&
    !_.get(gridState, `grid.${square}.lava`) &&
    !_.get(gridState, `grid.${square}.ventName`) &&
    !voidRunSquares.includes(`${square}`)
  ) {
    grid.push(square);
    runToDFS(x - 1, y, distance - 1);
    runToDFS(x + 1, y, distance - 1);
    runToDFS(x, y - 1, distance - 1);
    runToDFS(x, y + 1, distance - 1);
  }
};

/**
 * @function calculateRunZones
 * @description using DFS to determine true run zones
 * @param {String} square
 * @param {Number*} pop
 * @returns {Array}
 */
export const calculateRunZones = (square, pop) => {
  console.log("calculateRunZones");
  const coord = square.split("_");
  const coord0 = parseFloat(coord[0]);
  const coord1 = parseFloat(coord[1]);

  runToDFS(coord0, coord1, pop);

  const newGrid = [...grid];
  grid = [];
  return _.uniqBy(newGrid);
};
