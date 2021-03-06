/** @module helperFunctions */

import _ from "lodash";

import store from "../../redux/configureStore";
import actions from "../../redux/Actions";

import { aiPlayers } from "../../data/playerData";

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
const surroundByLavaDFS = (grid, x, y, distance) => {
  const thisGrid = [...grid];
  if (x > thisGrid.length - 1 || x < 0 || y > thisGrid[0].length || y < 0)
    return;

  if (
    parseFloat(thisGrid[x][y]) === 0 ||
    parseFloat(thisGrid[x][y]) > distance
  ) {
    thisGrid[x][y] = distance;
  }

  if (x > 0 && (thisGrid[x - 1][y] === 0 || thisGrid[x - 1][y] > distance)) {
    surroundByLavaDFS(thisGrid, x - 1, y, distance + 1);
  }

  if (
    x < thisGrid.length - 1 &&
    (thisGrid[x + 1][y] === 0 || thisGrid[x + 1][y] > distance)
  ) {
    surroundByLavaDFS(thisGrid, x + 1, y, distance + 1);
  }

  if (y > 0 && (thisGrid[x][y - 1] === 0 || thisGrid[x][y - 1] > distance)) {
    surroundByLavaDFS(thisGrid, x, y - 1, distance + 1);
  }

  if (
    x < thisGrid[0].length - 1 &&
    (thisGrid[x][y + 1] === 0 || thisGrid[x][y + 1] > distance)
  ) {
    surroundByLavaDFS(thisGrid, x, y + 1, distance + 1);
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
      let gridValue = _.get(gridState, `grid.${x}_${y}.lava`) ? "L" : 0;
      if (tile === `${x}_${y}`) gridValue = "L";
      if (voidLavaSquares.includes(`${x}_${y}`)) {
        gridValue = "W";
      }
      if (gridValue === 0 && gateSquares.includes(`${x}_${y}`)) {
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

    if (tempGrid[x][y] === "X") surroundByLavaDFS(tempGrid, x, y, 1);
  });

  for (let x = 0; x < rows; x += 1) {
    for (let y = 0; y < columns; y += 1) {
      if (tempGrid[x][y] === 0) {
        tempGrid[x][y] = "L";
        surroundedTiles.push(`${x}_${y}`);
      } else if (
        typeof tempGrid[x][y] === "number" &&
        _.get(gridState, `grid.${x}_${y}.distanceToExit`) &&
        parseFloat(tempGrid[x][y]) !==
          _.get(gridState, `grid.${x}_${y}.distanceToExit`)
      ) {
        store.dispatch(
          actions.updateDistanceToExitInStore(`${x}_${y}`, tempGrid[x][y])
        );
        console.log("update grid", x, y, "distance to:", tempGrid[x][y]);
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
 * @param {Number*} population
 * @returns {Array}
 */
export const calculateRunZones = (square, population) => {
  console.log("calculateRunZones");
  const coord = square.split("_");
  const coord0 = parseFloat(coord[0]);
  const coord1 = parseFloat(coord[1]);

  runToDFS(coord0, coord1, population);

  const newGrid = [...grid];
  grid = [];
  return _.uniqBy(newGrid);
};

/**
 * @function squareHotness
 * @description return number of unique lava tile types surrounding square
 * @param {Object} gridState
 * @param {String} square
 */
export const squareHotness = square => {
  const { gridState } = store.getState();
  const coord = square.split("_");
  const coord0 = parseFloat(coord[0]);
  const coord1 = parseFloat(coord[1]);
  const discoveredLavas = [];
  const lavas = [
    _.get(gridState, `grid.${coord0 - 1}_${coord1}.lava`),
    _.get(gridState, `grid.${coord0 + 1}_${coord1}.lava`),
    _.get(gridState, `grid.${coord0}_${coord1 - 1}.lava`),
    _.get(gridState, `grid.${coord0}_${coord1 + 1}.lava`)
  ];
  for (let i = 0; i < 4; i += 1) {
    if (lavas[i] && !discoveredLavas.includes(lavas[i])) {
      discoveredLavas.push(lavas[i]);
    }
  }
  return discoveredLavas.length;
};

/**
 * @function runnerRecommendations
 * @description set recommendationsArray for running (initial run for your lives and after placement but with
 * run counters left over)
 * @returns {Array}
 */
export const runnerRecommendations = () => {
  const {
    gridState,
    playersState: { activePlayer, details, totalTurns }
  } = store.getState();
  const aiPlayer = aiPlayers[_.get(details, `${activePlayer}.name`)];
  const recommendations = [];
  Object.keys(gridState.grid).forEach(square => {
    const gridSquare = _.get(gridState, `grid.${square}`);
    const occupants = _.get(gridSquare, "occupants", []);
    const myOccupants = occupants.filter(
      occupant => occupant.player === activePlayer
    );
    const diversity = _.uniqBy(occupants.map(occupant => occupant.player));
    if (myOccupants.length > 0) {
      // in diverse group -
      let value = 2 + myOccupants.length - diversity.length;
      // next to lava +
      value += squareHotness(square) * aiPlayer.cautious;
      // close to exit
      value += 1 - gridSquare.distanceToExit * 0.2;
      // already moved this turn
      if (myOccupants.length === 1 && myOccupants[0].lastMoved === totalTurns) {
        value = -2;
      }

      recommendations.push({
        square,
        value
      });
    }
  });
  return recommendations;
};

/**
 * @function runToRecommendations
 * @description determine recommendation for run to square
 * @param {Array} targetZones
 * @param {String} startSquare
 * @param {String} activePlayer
 * @returns {Array}
 */
export const runToRecommendations = (targetZones, startSquare) => {
  const { gridState, playersState } = store.getState();
  const aiPlayer =
    aiPlayers[_.get(playersState, `details.${playersState.activePlayer}.name`)];
  const recommendations = [];
  targetZones.forEach(square => {
    if (square !== startSquare) {
      let value = 1;
      const gridSquare = _.get(gridState, `grid.${square}`);
      const occupants = _.get(gridSquare, "occupants", []);
      const diversity = _.uniqBy(occupants.map(occupant => occupant.player));
      // closest to exit
      value += 5 - _.get(gridSquare, "distanceToExit", 0);
      // most diverse group
      value += (occupants.length + diversity.length) * 0.1;
      // dangerous square
      value -= squareHotness(square) * 0.5 * aiPlayer.cautious;

      recommendations.push({
        square,
        value
      });
    }
  });

  return recommendations;
};

/**
 * @function AIDetermineCardToPlay
 * @description determine which card an AI player should play based on recommendations
 * @returns {String} card
 */
export const AIDetermineCardToPlay = () => {
  const {
    cardsState: { cards },
    gamePlayState,
    playersState
  } = store.getState();
  const playSquare = _.get(gamePlayState, "recommendations[0].square");
  const playerHand = _.get(
    playersState,
    `details.${playersState.activePlayer}.hand`
  );
  let playThisCard = "";
  playerHand.forEach(card => {
    if (cards[card].grid.includes(playSquare)) {
      playThisCard = card;
    }
  });
  return playThisCard;
};
